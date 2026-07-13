const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const rawApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim();

if (!rawProjectId || !rawDataset) {
  throw new Error(
    "Missing Sanity environment values. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET before loading the Studio."
  );
}

export const apiVersion = rawApiVersion ?? "2025-02-19";
export const dataset = rawDataset;
export const projectId = rawProjectId;