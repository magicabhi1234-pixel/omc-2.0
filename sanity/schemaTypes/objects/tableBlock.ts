import { defineField, defineType } from "sanity";

export const tableRow = defineType({
  name: "tableRow",
  title: "Row",
  type: "object",

  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: { cells: "cells" },
    prepare({ cells }: { cells?: string[] }) {
      return { title: (cells ?? []).join(" | ") || "Empty row" };
    },
  },
});

export const tableBlock = defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",

  fields: [
    defineField({
      name: "hasHeaderRow",
      title: "First row is a header row",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "tableRow" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: { rows: "rows" },
    prepare({ rows }: { rows?: unknown[] }) {
      return { title: `Table (${rows?.length ?? 0} rows)` };
    },
  },
});
