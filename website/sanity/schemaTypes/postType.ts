/* eslint-disable */
// @ts-nocheck
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Article / Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'meta', title: 'Meta & Taxonomy' },
    { name: 'seo', title: 'SEO & AEO Optimization' },
    { name: 'relations', title: 'Relationships' },
  ],
  fields: [
    // Content Group
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'text',
      group: 'content',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alternative Text' },
        { name: 'caption', type: 'string', title: 'Caption' }
      ]
    }),
    defineField({
      name: 'body',
      title: 'Body Content (Markdown/Rich Text)',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }], // Uses official @sanity/code-input
      group: 'content',
    }),

    // Meta & Taxonomy
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Estimated Reading Time (mins)',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: { list: ['Beginner', 'Intermediate', 'Advanced', 'Executive'] },
      group: 'meta',
    }),
    defineField({
      name: 'technologies',
      title: 'Related Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'meta',
    }),

    // SEO & AEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'primaryKeyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'faqs',
      title: 'Structured FAQs (AEO/SEO)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer' }
          ]
        }
      ],
      group: 'seo',
    }),

    // Relationships
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['Backend Engineering', 'AI Engineering', 'RAG Systems', 'Voice Agents']
      },
      group: 'relations',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      group: 'relations',
    }),
  ],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'mainImage' },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
