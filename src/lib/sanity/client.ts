import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false";

/** True once real project config is present - false means every Sanity fetch will fail (and be caught by `sanityFetch`'s fallback). */
export const isSanityConfigured = Boolean(projectId && dataset);

if (!isSanityConfigured) {
  // Deliberately not throwing here: this file is imported by nearly every
  // page (via the registry), so throwing at module scope would crash the
  // entire build/render rather than just degrading Sanity-backed content.
  // `createClient` requires non-empty strings, so a placeholder is used -
  // any resulting fetch fails at request time and is caught by `sanityFetch`.
  console.error(
    "[sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET - " +
      "Sanity-backed content (landing pages, blog posts, universities, testimonials) " +
      "will be unavailable until these are set."
  );
}

/** Read-only client for rendering pages. Uses the CDN in production for speed. */
export const sanity = createClient({
  projectId: projectId || "misconfigured",
  dataset: dataset || "misconfigured",
  apiVersion,
  useCdn: isSanityConfigured && useCdn,
});

/** Write-capable client for the migration script only - never import this from app code. */
export const sanityWriteClient = createClient({
  projectId: projectId || "misconfigured",
  dataset: dataset || "misconfigured",
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

type SanityFetchOptions<QueryResponse> = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  fallback: QueryResponse;
};

/**
 * Time-based safety net (seconds) on top of the primary on-demand
 * revalidation path (the Sanity webhook -> /api/revalidate -> revalidateTag).
 * If the webhook is ever misconfigured or fails silently again, no page can
 * go stale for longer than this - it isn't the main freshness mechanism.
 */
const FALLBACK_REVALIDATE_SECONDS = 300;

/**
 * Fetches from Sanity with tag-based revalidation, returning `fallback`
 * (instead of throwing) if the request fails - so a Sanity outage degrades
 * a page rather than 500ing it.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  fallback,
}: SanityFetchOptions<QueryResponse>): Promise<QueryResponse> {
  try {
    return await sanity.fetch<QueryResponse>(query, params, {
      next: { tags, revalidate: FALLBACK_REVALIDATE_SECONDS },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}
