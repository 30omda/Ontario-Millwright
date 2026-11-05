import { defineField, defineType } from "sanity";

/** Singleton holding the home page copy. Lists (services, industries, projects) come from their own documents. */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
  ],
  fields: [
    defineField({
      name: "heroHeadline",
      type: "string",
      group: "hero",
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: "heroAccent",
      title: "Hero accent (yellow)",
      type: "string",
      group: "hero",
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: "heroSubcopy",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "heroVideo",
      type: "file",
      group: "hero",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({ name: "heroPoster", type: "image", group: "hero" }),
    defineField({
      name: "capabilities",
      type: "array",
      of: [{ type: "capability" }],
      group: "hero",
      validation: (r) => r.length(4),
    }),
    defineField({
      name: "marqueeRowA",
      type: "array",
      of: [{ type: "string" }],
      group: "sections",
    }),
    defineField({
      name: "marqueeRowB",
      type: "array",
      of: [{ type: "string" }],
      group: "sections",
    }),
    defineField({
      name: "servicesIntro",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "industriesIntro",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "workIntro",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "safetyBody",
      type: "text",
      rows: 3,
      group: "sections",
    }),
    defineField({
      name: "aboutBody",
      type: "text",
      rows: 4,
      group: "sections",
    }),
    defineField({ name: "seo", type: "seo", group: "sections" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
