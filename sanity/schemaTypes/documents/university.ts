import { defineField, defineType } from "sanity";

const APPROVAL_OPTIONS = [
  "UGC",
  "AICTE",
  "DEB",
  "AIU",
  "AMBA",
  "NAAC A++",
  "NAAC A+",
  "NAAC A",
];

export const university = defineType({
  name: "university",
  title: "University",
  type: "document",

  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "academics", title: "Academics & Fees" },
    { name: "credibility", title: "Rankings & Approvals" },
    { name: "links", title: "Links" },
  ],

  fields: [
    defineField({
      name: "name",
      title: "University Name",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
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
      group: "basic",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the logo for accessibility and SEO.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featured",
      title: "Featured University",
      description: "Featured universities can be highlighted in listings.",
      type: "boolean",
      group: "basic",
      initialValue: false,
    }),

    defineField({
      name: "studyMode",
      title: "Study Mode",
      type: "string",
      group: "academics",
      options: {
        list: [
          { title: "Online", value: "Online" },
          { title: "Distance", value: "Distance" },
          { title: "Online & Distance", value: "Online & Distance" },
        ],
        layout: "radio",
      },
      initialValue: "Online & Distance",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "academics",
      initialValue: "2 Years",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "text",
      group: "academics",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "startingFee",
      title: "Starting Fee",
      description: 'Displayed exactly as entered, e.g. "₹2,25,000" or "Contact for fee".',
      type: "string",
      group: "academics",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "emi",
      title: "EMI",
      description: 'e.g. "₹8,292/Month". Leave blank if not applicable.',
      type: "string",
      group: "academics",
    }),

    defineField({
      name: "placementSupport",
      title: "Placement Support",
      description: 'e.g. "Yes". Leave blank if not applicable.',
      type: "string",
      group: "academics",
    }),

    defineField({
      name: "rating",
      title: "Rating",
      description: "Out of 5.",
      type: "number",
      group: "credibility",
      validation: (Rule) => Rule.min(0).max(5),
    }),

    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      group: "credibility",
      validation: (Rule) => Rule.min(0).integer(),
    }),

    defineField({
      name: "approvals",
      title: "Approvals",
      type: "array",
      group: "credibility",
      of: [{ type: "string" }],
      options: {
        list: APPROVAL_OPTIONS,
      },
    }),

    defineField({
      name: "rankings",
      title: "Rankings",
      type: "array",
      group: "credibility",
      of: [{ type: "ranking" }],
    }),

    defineField({
      name: "brochureUrl",
      title: "Brochure URL",
      type: "url",
      group: "links",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      group: "links",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
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
