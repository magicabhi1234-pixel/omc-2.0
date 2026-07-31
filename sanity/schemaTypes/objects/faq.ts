import { defineType, defineField } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",

  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "question",
    },
  },
});
