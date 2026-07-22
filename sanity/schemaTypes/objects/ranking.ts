import { defineType, defineField } from "sanity";

export const ranking = defineType({
  name: "ranking",
  title: "Ranking",
  type: "object",

  fields: [
    defineField({
      name: "agency",
      title: "Ranking Agency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "rank",
      title: "Rank",
      type: "number",
    }),

    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
  ],

  preview: {
    select: {
      title: "agency",
      subtitle: "rank",
    },

    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Rank #${subtitle}` : "",
      };
    },
  },
});