const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },

    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    },

    {
      name: 'category',
      title: 'Project Category',
      type: 'string',
      options: {
        list: [
          { title: '3D Fabrication', value: 'fabrication' },
          { title: 'Architectural Design', value: 'architecture' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      initialValue: 'architecture',
    },

    {
      name: 'type',
      title: 'Project Type',
      type: 'string',
      description: 'e.g. Residential, Resort, Commercial for Architecture OR Model, Prototype for Fabrication',
    },

    {
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
    },

    {
      name: 'details',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string' },
          ],
        },
      ],
    },

    {
      name: 'summary',
      type: 'text',
    },
  ],
}

export default project