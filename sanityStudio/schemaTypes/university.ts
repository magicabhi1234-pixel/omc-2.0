import { defineType, defineField } from 'sanity'

export const university = defineType({
  name: 'university',
  title: 'University',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'fees',
      title: 'Fees',
      type: 'number',
      description: 'Total fees or fee amount',
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'string',
    }),
    defineField({
      name: 'zone',
      title: 'Zone',
      type: 'string',
    }),
    defineField({
      name: 'placementSupport',
      title: 'Placement Support',
      type: 'boolean',
    }),
    defineField({
      name: 'emiAvailable',
      title: 'EMI Available',
      type: 'boolean',
    }),
  ],
})
