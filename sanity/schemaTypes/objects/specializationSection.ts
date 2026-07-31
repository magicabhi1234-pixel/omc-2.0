import { defineField, defineType } from "sanity";

export const specializationItem = defineType({
  name: "specializationItem",
  title: "Specialization",
  type: "object",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),

    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
    }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});

export const specializationSection = defineType({
  name: "specializationSection",
  title: "Specializations Section",
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
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "specializationItem" }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Specializations Section" };
    },
  },
});
