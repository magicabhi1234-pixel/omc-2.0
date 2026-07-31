import { defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",

  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "FAQ Section" };
    },
  },
});
