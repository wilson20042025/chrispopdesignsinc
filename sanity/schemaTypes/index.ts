import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import post from './post'

export const schema: { types: SchemaTypeDefinition[], templates: any } = {
  types: [project, post],
  templates: (prev: any) => [
    ...prev,
    {
      id: 'project-fabrication',
      title: '3D Fabrication Project',
      schemaType: 'project',
      value: { category: 'fabrication' },
    },
    {
      id: 'project-architecture',
      title: 'Architectural Design Project',
      schemaType: 'project',
      value: { category: 'architecture' },
    },
  ],
}
