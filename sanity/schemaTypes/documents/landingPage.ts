import { defineType, defineField } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",

  fields: [
    // Basic Information

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
      name: "pageType",
      title: "Page Type",
      type: "string",
      options: {
        list: [
          { title: "Online MBA", value: "online-mba" },
          { title: "Distance MBA", value: "distance-mba" },
          { title: "Online MCA", value: "online-mca" },
          { title: "Distance MCA", value: "distance-mca" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "region",
      title: "Region",
      type: "string",
      options: {
        list: [
          { title: "North", value: "north" },
          { title: "South", value: "south" },
          { title: "East", value: "east" },
          { title: "West", value: "west" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Hero Section

    defineField({
      name: "hero",
      title: "Hero Section",
      type: "hero",
    }),
    
    defineField({
  name: "universitySection",
  title: "University Section",
  type: "universitySection",
}),

    // Universities

    defineField({
      name: "universities",
      title: "Universities",
      description: "Drag & drop to change display order.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "university" }],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),

    // Content Section

    defineField({
      name: "contentHeading",
      title: "Content Heading",
      type: "string",
    }),

    defineField({
      name: "contentDescription",
      title: "Content Description",
      type: "array",
      of: [
        {
          type: "block",
        },
      ],
    }),

    // CTA Section

    defineField({
      name: "cta",
      title: "CTA Section",
      type: "cta",
    }),

    // SEO

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),

    // Status

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          {
            title: "Draft",
            value: "draft",
          },
          {
            title: "Published",
            value: "published",
          },
        ],
        layout: "radio",
      },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "hero.image",
    },

    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `/${subtitle}` : "No Slug",
        media,
      };
    },
  },
});