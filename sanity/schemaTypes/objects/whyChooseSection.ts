import { defineField, defineType } from "sanity";

export const whyChooseItem = defineType({
  name: "whyChooseItem",
  title: "Why Choose Item",
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
    select: {
      title: "title",
    },
  },
});

export const whyChooseSection = defineType({
  name: "whyChooseSection",
  title: "Why Choose Section",
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
      title: "Items",
      type: "array",
      of: [{ type: "whyChooseItem" }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Why Choose Section" };
    },
  },
});
