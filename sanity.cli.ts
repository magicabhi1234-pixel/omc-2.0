import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    autoUpdates: true,
  },
});
