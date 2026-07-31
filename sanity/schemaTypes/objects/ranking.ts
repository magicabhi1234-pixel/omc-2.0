import { defineType, defineField } from "sanity";

export const ranking = defineType({
  name: "ranking",
  title: "Ranking",
  type: "object",

  fields: [
    defineField({
      name: "source",
      title: "Ranking Source",
      description: "e.g. NIRF, Times of India",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "value",
      title: "Value",
      description: "e.g. #32, Top 50",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "source",
      subtitle: "value",
    },
  },
});
