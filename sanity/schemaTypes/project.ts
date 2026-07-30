const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fieldsets: [
    { 
      name: 'basic', 
      title: '1. Basic Information', 
      description: 'Core details about the project like title, category, and summary.',
      options: { collapsible: true, collapsed: false } 
    },
    { 
      name: 'media', 
      title: '2. Media & Specifications', 
      description: 'Images and specific details/specs about the project.',
      options: { collapsible: true, collapsed: false } 
    }
  ],
  fields: [
    { 
      name: 'title', 
      title: 'Project Title',
      type: 'string',
      description: 'The main name of the project. This will be displayed on the website.',
      fieldset: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The unique URL path for this project. Just click "Generate" to automatically create it from the title.',
      options: { source: 'title', maxLength: 96 },
      fieldset: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Project Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Which category does this project belong to? (e.g. Architecture or Fabrication)',
      validation: (Rule: any) => Rule.required(),
      fieldset: 'basic',
    },
    {
      name: 'summary',
      title: 'Project Summary / Description',
      type: 'text',
      description: 'A brief description of the project. This gives visitors context about the work.',
      fieldset: 'basic',
    },
    {
      name: 'images',
      title: 'Project Images',
      type: 'array',
      description: 'Upload high-quality images of the project. The first image will often be used as the cover photo.',
      of: [{ type: 'image', options: { hotspot: true } }],
      fieldset: 'media',
    },
    {
      name: 'details',
      title: 'Project Specifications / Details',
      type: 'array',
      description: 'Add specific details or specs about the project. (e.g. Label: "Location", Value: "New York, NY")',
      fieldset: 'media',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Detail Label', type: 'string', description: 'e.g. Client, Year, Location, Materials' },
            { name: 'value', title: 'Detail Value', type: 'string', description: 'e.g. John Doe, 2024, Miami FL, Wood & Steel' },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value'
            }
          }
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
    prepare({ title, media }: any) {
      return {
        title: title || 'Untitled',
        media: media,
      }
    },
  },
}

export default project