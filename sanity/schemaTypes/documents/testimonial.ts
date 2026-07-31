import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Student Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "designation",
      title: "Designation",
      description: 'e.g. "Marketing Manager"',
      type: "string",
    }),

    defineField({
      name: "university",
      title: "University Attended",
      description: 'Free text, e.g. "Amity University" - not a reference, since this is just attribution copy.',
      type: "string",
    }),

    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "review",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "rating",
      title: "Rating",
      description: "Out of 5.",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "university",
      media: "image",
    },
  },
});
