const post = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fieldsets: [
    { 
      name: 'basic', 
      title: '1. Basic Information', 
      description: 'Core details about the blog post like title, category, and excerpt.',
      options: { collapsible: true, collapsed: false } 
    },
    { 
      name: 'content', 
      title: '2. Post Content & Media', 
      description: 'The actual text, images, and main cover image of the post.',
      options: { collapsible: true, collapsed: false } 
    }
  ],
  fields: [
    { 
      name: 'title', 
      title: 'Post Title',
      type: 'string', 
      description: 'The main title of your blog post.',
      fieldset: 'basic',
      validation: (Rule: any) => Rule.required() 
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The unique URL path for this post. Just click "Generate" to automatically create it from the title.',
      options: { source: 'title' },
      fieldset: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Publish Date',
      description: 'When this post should be published. It defaults to the current date and time.',
      type: 'datetime',
      fieldset: 'basic',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'category',
      title: 'Post Category',
      type: 'string',
      description: 'The topic category of this post.',
      fieldset: 'basic',
      options: {
        list: [
          { title: 'Innovation', value: 'Innovation' },
          { title: 'Design', value: 'Design' },
          { title: 'Philosophy', value: 'Philosophy' },
          { title: 'Architecture', value: 'Architecture' },
        ],
      },
    },
    {
      name: 'excerpt',
      title: 'Short Excerpt',
      type: 'text',
      description: 'A short summary of the post used on the main blog feed page.',
      fieldset: 'basic',
      rows: 3,
    },
    {
      name: 'mainImage',
      title: 'Main Cover Image',
      type: 'image',
      description: 'The featured image displayed at the top of the post and in the blog feed.',
      fieldset: 'content',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      description: 'The main content of your blog post. You can mix text formatting and images here.',
      fieldset: 'content',
      of: [
        { type: 'block' },
        { type: 'image' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'mainImage',
    },
  },
}

export default post
