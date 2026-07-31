import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  // Studio has no usable degraded mode without these - unlike the app's
  // sanityFetch, there's nothing to gracefully fall back to. This at least
  // leaves a clear breadcrumb in the browser console before Sanity's own
  // internal client throws (NEXT_PUBLIC_ vars are inlined at build time, so
  // this means the Vercel deployment was built without them set).
  console.error(
    "[sanity.config] Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET - " +
      "Studio cannot start. Set these in Vercel's project environment variables and redeploy."
  );
}

export default defineConfig({
  name: "default",
  title: "OMC Studio",

  projectId: projectId || "",
  dataset: dataset || "",
  apiVersion,

  basePath: "/studio",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});