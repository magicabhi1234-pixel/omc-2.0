import { defineType, defineField } from "sanity";

export const approval = defineType({
  name: "approval",
  title: "Approval",
  type: "object",

  fields: [
    defineField({
      name: "name",
      title: "Approval Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "logo",
      title: "Approval Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});