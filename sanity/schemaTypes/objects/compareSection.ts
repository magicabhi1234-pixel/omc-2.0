import { defineField, defineType } from "sanity";

export const compareFeature = defineType({
  name: "compareFeature",
  title: "Compare Feature Row",
  type: "object",

  fields: [
    defineField({
      name: "label",
      title: "Row Label",
      description: 'e.g. "Total Fees"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "key",
      title: "University Field",
      description: "Which university field this row compares.",
      type: "string",
      options: {
        list: [
          { title: "Starting Fee", value: "startingFee" },
          { title: "Duration", value: "duration" },
          { title: "Study Mode", value: "studyMode" },
          { title: "Eligibility", value: "eligibility" },
          { title: "Placement Support", value: "placementSupport" },
          { title: "EMI", value: "emi" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "label",
      subtitle: "key",
    },
  },
});

export const compareSection = defineType({
  name: "compareSection",
  title: "Compare Section",
  type: "object",

  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
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
      rows: 2,
    }),

    defineField({
      name: "features",
      title: "Comparison Rows",
      type: "array",
      of: [{ type: "compareFeature" }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Compare Section" };
    },
  },
});
