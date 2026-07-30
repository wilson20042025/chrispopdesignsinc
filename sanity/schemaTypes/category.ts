const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'The main name of the category (e.g. "Architecture" or "Fabrication").',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The URL path for this category. Just click "Generate" to create it automatically from the title.',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Tagline',
      type: 'string',
      description: 'A short, catchy subtitle or description for this category (e.g. "The Workshop" or "The Studio").',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Optional: Upload a custom cover image to represent this category. If you leave this blank, the first image from the most recent project in this category will be used automatically.',
      options: { hotspot: true },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
    },
  },
}

export default category
