import { defineField, defineType } from "sanity";

export const capability = defineType({
  name: "capability",
  title: "Capability",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: "description",
      type: "string",
      validation: (r) => r.required().max(48),
    }),
    defineField({
      name: "highlight",
      title: "Yellow card",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
