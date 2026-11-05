import { defineField, defineType } from "sanity";

export const detail = defineType({
  name: "detail",
  title: "Detail",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (r) => r.required().max(16),
    }),
    defineField({
      name: "value",
      type: "string",
      validation: (r) => r.required().max(40),
    }),
  ],
});
