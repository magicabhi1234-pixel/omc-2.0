import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero Section",
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
      name: "image",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
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
      initialValue: "Free Counselling",
    }),

    defineField({
      name: "stat1Value",
      title: "Stat 1 Value",
      type: "string",
      initialValue: "100+",
    }),

    defineField({
      name: "stat1Label",
      title: "Stat 1 Label",
      type: "string",
      initialValue: "Universities",
    }),

    defineField({
      name: "stat2Value",
      title: "Stat 2 Value",
      type: "string",
      initialValue: "UGC",
    }),

    defineField({
      name: "stat2Label",
      title: "Stat 2 Label",
      type: "string",
      initialValue: "Approved",
    }),

    defineField({
      name: "stat3Value",
      title: "Stat 3 Value",
      type: "string",
      initialValue: "24×7",
    }),

    defineField({
      name: "stat3Label",
      title: "Stat 3 Label",
      type: "string",
      initialValue: "Support",
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Hero Section",
      };
    },
  },
});