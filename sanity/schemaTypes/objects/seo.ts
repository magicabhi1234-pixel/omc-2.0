import { defineType, defineField } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",

  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      description: "Shown as the page title in search results and browser tabs. Recommended: 50-60 characters (shorter titles risk looking thin, longer ones get truncated by Google).",
      type: "string",
      validation: (Rule) => [
        Rule.required().max(60),
        Rule.custom((title: string | undefined) => {
          if (!title) return true;
          return title.length < 30
            ? "Under 30 characters - consider a fuller title (50-60 is ideal) so it isn't too thin for search results."
            : true;
        }).warning(),
      ],
    }),

    defineField({
      name: "metaDescription",
      title: "Meta Description",
      description: "Shown as the preview snippet in search results. Recommended: 120-160 characters (shorter descriptions waste an opportunity to entice clicks; longer ones get cut off).",
      type: "text",
      rows: 3,
      validation: (Rule) => [
        Rule.required().max(160),
        Rule.custom((description: string | undefined) => {
          if (!description) return true;
          return description.length < 70
            ? "Under 70 characters - descriptions of 120-160 characters typically perform better in search results."
            : true;
        }).warning(),
      ],
    }),

    defineField({
      name: "keywords",
      title: "Keywords",
      description: "Optional and largely legacy - modern search engines (including Google) do not use this field for ranking. Safe to leave empty.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      description: "Only set this to point to a DIFFERENT URL than this page's own address (e.g. if this content is duplicated elsewhere). Leave blank in every normal case - the page's own URL is used automatically.",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      description: "Shown when this page is shared on social media (Facebook, LinkedIn, WhatsApp, etc.). Recommended size: 1200x630px. Falls back to the page's own hero/featured image if left blank.",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "noIndex",
      title: "No Index",
      description: "Turn on to tell search engines NOT to index this page (e.g. for a duplicate or thank-you page). Leave off for every normal, public-facing page.",
      type: "boolean",
      initialValue: false,
    }),
  ],
});