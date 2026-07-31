import { defineField, defineType } from "sanity";

export const statCard = defineType({
  name: "statCard",
  title: "Stat Card",
  type: "object",

  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: 'e.g. "50+", "98%"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "value",
      subtitle: "label",
    },
  },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats Section",
  type: "object",

  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [{ type: "statCard" }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Stats Section" };
    },
  },
});
