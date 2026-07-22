import { defineType, defineField } from "sanity";

export const fee = defineType({
  name: "fee",
  title: "Fee Structure",
  type: "object",

  fields: [
    defineField({
      name: "course",
      title: "Course Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "semesterFee",
      title: "Semester Fee",
      type: "number",
    }),

    defineField({
      name: "totalFee",
      title: "Total Fee",
      type: "number",
    }),
  ],

  preview: {
    select: {
      title: "course",
      subtitle: "totalFee",
    },

    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `₹ ${subtitle}` : "",
      };
    },
  },
});