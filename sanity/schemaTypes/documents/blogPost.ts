import { defineField, defineType } from "sanity";
import { validateSlugFormat } from "../../lib/slugValidation";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Author & Categorization" },
    { name: "related", title: "FAQs & Related" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Blog Title",
      description: "Used in listings and as the page title unless overridden by the H1 below.",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "h1",
      title: "H1 Heading",
      description: "The heading shown at the top of the article. Defaults to the Blog Title if left blank.",
      type: "string",
      group: "content",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      description: "The post's URL path under /blog/, e.g. lpu-online-mba. Must be unique.",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 200,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => validateSlugFormat(slug)),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Short Description",
      description: "Used on listing cards and as a fallback meta description.",
      type: "text",
      group: "content",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "H5", value: "h5" },
            { title: "H6", value: "h6" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.required().uri({ scheme: ["http", "https"] }),
                  }),
                  defineField({
                    name: "openInNewTab",
                    title: "Open in new tab",
                    type: "boolean",
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        },
        { type: "tableBlock" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "meta",
      initialValue: "Admin",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      group: "meta",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "meta",
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "related",
      of: [{ type: "faq" }],
    }),

    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      validation: (Rule) => Rule.max(6),
    }),

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
      subtitle: "publishedDate",
      media: "featuredImage",
    },
  },
});
