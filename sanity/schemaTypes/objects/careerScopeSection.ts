import { defineField, defineType } from "sanity";

export const careerRole = defineType({
  name: "careerRole",
  title: "Career Role",
  type: "object",

  fields: [
    defineField({
      name: "title",
      title: "Role Title",
      description: 'e.g. "Digital Marketing Manager"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "salaryRange",
      title: "Salary Range",
      description: 'e.g. "₹6-12 LPA". Leave blank if not applicable.',
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
  ],

  preview: {
    select: { title: "title", subtitle: "salaryRange" },
  },
});

export const careerScopeSection = defineType({
  name: "careerScopeSection",
  title: "Career Scope Section",
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
      name: "roles",
      title: "Career Roles",
      type: "array",
      of: [{ type: "careerRole" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],

  preview: {
    prepare() {
      return { title: "Career Scope Section" };
    },
  },
});
