import { defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required().max(32),
    }),
    defineField({
      name: "description",
      type: "string",
      validation: (r) => r.required().max(56),
    }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
  ],
});
