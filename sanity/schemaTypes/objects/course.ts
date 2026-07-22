import { defineType, defineField } from "sanity";

export const course = defineType({
  name: "course",
  title: "Course",
  type: "object",

  fields: [
    defineField({
      name: "name",
      title: "Course Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
    }),

    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "string",
    }),

    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "online" },
          { title: "Distance", value: "distance" },
          { title: "Hybrid", value: "hybrid" },
        ],
      },
    }),

    defineField({
      name: "specializations",
      title: "Specializations",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "mode",
    },
  },
});