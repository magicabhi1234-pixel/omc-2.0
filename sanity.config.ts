'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { dataset, projectId } from './sanityStudio/env'
import { schema } from './sanityStudio/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [structureTool()],
})