import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isDbConfigured = Boolean(url && serviceRoleKey);

if (!isDbConfigured) {
  // Mirrors the old Sanity client's approach: don't throw at module scope
  // (this file is imported by the registry, which nearly every page uses),
  // just degrade - callers fall back to empty results via dbFetch below.
  console.error(
    "[db] Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - " +
      "CMS-backed content (landing pages, blog posts, universities, testimonials) will be unavailable until these are set."
  );
}

/**
 * Server-only, service-role client. Used for both the admin dashboard's
 * Server Actions (read/write) and the public frontend's reads (read-only in
 * practice, since nothing here is ever called from client components) - the
 * same trust boundary the old `sanity` read client had, since neither is
 * ever shipped to the browser.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  url || "https://misconfigured.supabase.co",
  serviceRoleKey || "misconfigured",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * Runs a Supabase query and returns `fallback` instead of throwing if it
 * fails - so a database outage degrades a page instead of 500ing it (same
 * contract as the old `sanityFetch`).
 */
export async function dbFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error("Database fetch failed:", error);
    return fallback;
  }
}
