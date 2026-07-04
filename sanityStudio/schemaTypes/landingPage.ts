import { defineField, defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "zone",
      title: "Zone",
      type: "string",
      options: {
        list: [
          { title: "North", value: "north" },
          { title: "South", value: "south" },
          { title: "East", value: "east" },
          { title: "West", value: "west" },
        ],
      },
    }),

    defineField({
      name: "mode",
      title: "Study Mode",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "online" },
          { title: "Distance", value: "distance" },
        ],
      },
    }),

    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
    }),

    defineField({
      name: "heroSubHeading",
      title: "Hero Sub Heading",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "featuredUniversities",
      title: "Featured Universities",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "university" }],
        },
      ],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 4,
    }),
  ],
});