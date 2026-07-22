import { defineField, defineType } from "sanity";

export const university = defineType({
  name: "university",
  title: "University",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "University Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "logo",
      title: "University Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "studyMode",
      title: "Study Mode",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "Online" },
          { title: "Distance", value: "Distance" },
          { title: "Online & Distance", value: "Online & Distance" },
        ],
        layout: "radio",
      },
      initialValue: "Online & Distance",
    }),

    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      initialValue: "2 Years",
    }),

    defineField({
      name: "approvals",
      title: "Approvals",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "UGC", value: "UGC" },
              { title: "AICTE", value: "AICTE" },
              { title: "DEB", value: "DEB" },
              { title: "AIU", value: "AIU" },
              { title: "NAAC A+", value: "NAAC A+" },
              { title: "NAAC A", value: "NAAC A" },
            ],
          },
        },
      ],
    }),

    defineField({
      name: "startingFees",
      title: "Starting Fees (₹)",
      type: "number",
    }),

    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "brochure",
      title: "Brochure PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),

    defineField({
      name: "brochureButtonText",
      title: "Brochure Button Text",
      type: "string",
      initialValue: "Download Brochure",
    }),

    defineField({
      name: "enquireButtonText",
      title: "Enquire Button Text",
      type: "string",
      initialValue: "Enquire Now",
    }),

    defineField({
      name: "featured",
      title: "Featured University",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "studyMode",
      media: "logo",
    },
  },
});