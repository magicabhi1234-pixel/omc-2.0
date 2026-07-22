import { defineField, defineType } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "CTA Section",
  type: "object",

  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      initialValue: "Admissions Open 2026-27",
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

    defineField({
      name: "primaryButtonText",
      title: "Primary Button Text",
      type: "string",
      initialValue: "Apply Now",
    }),

    defineField({
      name: "secondaryButtonText",
      title: "Secondary Button Text",
      type: "string",
      initialValue: "Talk to an Expert",
    }),

    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "CTA Section",
      };
    },
  },
});