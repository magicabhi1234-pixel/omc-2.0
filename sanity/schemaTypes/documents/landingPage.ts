import { defineType, defineField } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",

  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "hero", title: "Hero" },
    { name: "universities", title: "Universities" },
    { name: "sections", title: "Page Sections" },
    { name: "faq", title: "FAQ" },
    { name: "testimonials", title: "Testimonials" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // -------------------------------------------------------------------
    // Basic Information
    // -------------------------------------------------------------------

    defineField({
      name: "title",
      title: "Page Title",
      description: "Internal title, shown in Studio lists (not necessarily the on-page heading).",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      description: "The page's URL path, e.g. top-10-online-mba-universities-colleges-north-zone",
      type: "slug",
      group: "basic",
      options: {
        source: "title",
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      description: "Used to group pages on the Landing Pages hub.",
      type: "string",
      group: "basic",
      options: {
        list: [
          "Online MBA",
          "Distance MBA",
          "MBA Specializations",
          "Executive MBA",
          "University Pages",
          "Bachelor Programs",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "region",
      title: "Region",
      description: "Optional - only relevant for zone-specific pages.",
      type: "string",
      group: "basic",
      options: {
        list: [
          { title: "North", value: "north" },
          { title: "South", value: "south" },
          { title: "East", value: "east" },
          { title: "West", value: "west" },
          { title: "Not Region-Specific", value: "none" },
        ],
        layout: "radio",
      },
    }),

    // -------------------------------------------------------------------
    // Hero
    // -------------------------------------------------------------------

    defineField({
      name: "hero",
      title: "Hero Section",
      type: "hero",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),

    // -------------------------------------------------------------------
    // Universities
    // -------------------------------------------------------------------

    defineField({
      name: "universitySection",
      title: "University Section Intro",
      type: "universitySection",
      group: "universities",
    }),

    defineField({
      name: "universities",
      title: "Universities",
      description: "Drag & drop to change display order. This same list also powers the Search University box and the Compare tool.",
      type: "array",
      group: "universities",
      of: [
        {
          type: "reference",
          to: [{ type: "university" }],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),

    defineField({
      name: "compareSection",
      title: "Compare Section",
      type: "compareSection",
      group: "universities",
    }),

    // -------------------------------------------------------------------
    // Page Sections
    // -------------------------------------------------------------------

    defineField({
      name: "whyChoose",
      title: "Why Choose Section",
      type: "whyChooseSection",
      group: "sections",
    }),

    defineField({
      name: "stats",
      title: "Stats Section",
      type: "statsSection",
      group: "sections",
    }),

    defineField({
      name: "specializations",
      title: "Specializations Section",
      type: "specializationSection",
      group: "sections",
    }),

    defineField({
      name: "scholarshipBanner",
      title: "Scholarship Banner",
      type: "scholarshipBanner",
      group: "sections",
    }),

    // -------------------------------------------------------------------
    // FAQ
    // -------------------------------------------------------------------

    defineField({
      name: "faq",
      title: "FAQ Section",
      type: "faqSection",
      group: "faq",
    }),

    // -------------------------------------------------------------------
    // Testimonials
    // -------------------------------------------------------------------

    defineField({
      name: "testimonialsHeading",
      title: "Testimonials Heading",
      type: "string",
      group: "testimonials",
      initialValue: "What Our Students Say",
    }),

    defineField({
      name: "testimonials",
      title: "Testimonials",
      description: "Leave empty to show the site's default testimonials.",
      type: "array",
      group: "testimonials",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),

    // -------------------------------------------------------------------
    // CTA
    // -------------------------------------------------------------------

    defineField({
      name: "cta",
      title: "CTA Section",
      type: "cta",
      group: "cta",
      validation: (Rule) => Rule.required(),
    }),

    // -------------------------------------------------------------------
    // SEO
    // -------------------------------------------------------------------

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      validation: (Rule) => Rule.required(),
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
