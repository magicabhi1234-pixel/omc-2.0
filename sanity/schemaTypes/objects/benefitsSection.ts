import { defineField, defineType } from "sanity";

export const benefitItem = defineType({
  name: "benefitItem",
  title: "Benefit",
  type: "object",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "icon",
      title: "Icon",
      description: "Icon key used by the site's icon set (e.g. clock, wallet, briefcase).",
      type: "string",
    }),
  ],

  preview: {
    select: { title: "title" },
  },
});

export const benefitsSection = defineType({
  name: "benefitsSection",
  title: "Benefits Section",
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
      rows: 3,
    }),

    defineField({
      name: "items",
      title: "Benefits",
      type: "array",
      of: [{ type: "benefitItem" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],

  preview: {
    prepare() {
      return { title: "Benefits Section" };
    },
  },
});
