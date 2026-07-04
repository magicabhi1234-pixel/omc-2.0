import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanityStudio/env";
import { schema } from "./sanityStudio/schemaTypes";

export default defineConfig({
  name: "default",
  title: "OMC Studio",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    structureTool(),
  ],

  schema,
});