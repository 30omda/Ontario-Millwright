import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (r) => r.required().max(24),
    }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 4,
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: "details",
      type: "array",
      of: [{ type: "detail" }],
      validation: (r) => r.max(2),
    }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
});
