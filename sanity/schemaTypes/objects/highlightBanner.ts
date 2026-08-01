import { defineField, defineType } from "sanity";

export const highlightBanner = defineType({
  name: "highlightBanner",
  title: "Highlight Banner",
  description: "A callout banner for a key value proposition (e.g. placement support), shown near the end of the page.",
  type: "object",

  fields: [
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
      rows: 2,
    }),

    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Get Placement Assistance",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Highlight Banner" };
    },
  },
});
