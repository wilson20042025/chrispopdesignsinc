import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import post from './post'
import category from './category'

export const schema: { types: SchemaTypeDefinition[], templates: any } = {
  types: [category, project, post],
  templates: (prev: any) => [
    ...prev,
  ],
}
