// sanityStudio/lib/live.ts

import { client } from "./client";

// Temporary disable Live Content API
export const sanityFetch = client.fetch;

export const SanityLive = () => null;