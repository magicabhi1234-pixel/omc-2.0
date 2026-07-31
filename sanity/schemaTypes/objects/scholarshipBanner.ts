import { defineField, defineType } from "sanity";

export const scholarshipBanner = defineType({
  name: "scholarshipBanner",
  title: "Scholarship Banner",
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
      initialValue: "Apply For Scholarship",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Scholarship Banner" };
    },
  },
});
