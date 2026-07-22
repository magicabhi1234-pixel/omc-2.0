import { defineType, defineField } from "sanity";

export const placement = defineType({
  name: "placement",
  title: "Placement",
  type: "object",

  fields: [
    defineField({
      name: "highestPackage",
      title: "Highest Package",
      type: "string",
    }),

    defineField({
      name: "averagePackage",
      title: "Average Package",
      type: "string",
    }),

    defineField({
      name: "placementPercentage",
      title: "Placement Percentage",
      type: "number",
    }),

    defineField({
      name: "topRecruiters",
      title: "Top Recruiters",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});