import { defineField, defineType } from "sanity";

export const universitySection = defineType({
  name: "universitySection",
  title: "University Section",
  type: "object",

  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      initialValue: "Top Online Universities",
    }),

    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "University Section",
      };
    },
  },
});