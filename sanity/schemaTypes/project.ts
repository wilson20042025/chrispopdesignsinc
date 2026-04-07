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
      name: 'type',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Resort', value: 'resort' },
          { title: 'Commercial', value: 'commercial' },
        ],
      },
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