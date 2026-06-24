import { type SchemaTypeDefinition } from 'sanity'
import { university } from './university'
import { blogPost } from './blogPost'
import { landingPage } from './landingPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [university, blogPost, landingPage],
}
