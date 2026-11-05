import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({
      name: "phone",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number (E.164, e.g. 14165550000)",
      type: "string",
    }),
    defineField({ name: "serviceArea", type: "string" }),
    defineField({
      name: "calLink",
      title: "Cal.com link (user/event)",
      type: "string",
    }),
    defineField({
      name: "emergency247",
      title: "Emergency service is 24/7",
      type: "boolean",
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
