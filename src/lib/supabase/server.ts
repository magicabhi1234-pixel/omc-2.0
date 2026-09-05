import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Session-aware Supabase client for Server Components / Server Actions in
 * the admin dashboard - reads/writes the auth cookie so `auth.getUser()`
 * reflects whoever is actually logged in. Uses the anon key (RLS-scoped);
 * privileged writes go through `supabaseAdmin` (service role) instead, after
 * this client has confirmed who's asking and what they're allowed to do.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component (not a Server Action/Route
          // Handler) - cookies can't be set there. Middleware refreshes the
          // session on every request, so this is safe to ignore.
        }
      },
    },
  });
}
