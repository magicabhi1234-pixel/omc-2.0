import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false";

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET environment variables."
  );
}

/** Read-only client for rendering pages. Uses the CDN in production for speed. */
export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

/** Write-capable client for the migration script only - never import this from app code. */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
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
      next: { tags },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}
