import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { projectId, dataset } from './src/sanity/env'

export default defineConfig({
  basePath: '/studio',
  name: 'med-shop-studio',
  title: 'Med Shop Studio',
  projectId: projectId || 'demo-project',
  dataset: dataset || 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
