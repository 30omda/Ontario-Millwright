import "server-only";
import { seedHome } from "./seed";
import type { HomeContent, SiteSettings } from "./types";

type ServiceText = Pick<HomeContent["services"]["items"][number], "title" | "summary" | "description" | "scope" | "fullScope"> & {
  imageAlt: string;
};
type Dict = {
  settings: Pick<SiteSettings, "tagline" | "serviceArea">;
  hero: Pick<HomeContent["hero"], "accent" | "subcopy" | "capabilities">;
  marquee: HomeContent["marquee"];
  services: { title: string; accent: string; intro: string; items: Record<string, ServiceText> };
  industries: { title: string; accent: string; intro: string; items: Record<string, { title: string; description: string }> };
  process: { title: string; accent: string; titleEnd: string; steps: Record<string, { title: string; description: string }> };
  safety: Pick<HomeContent["safety"], "title" | "accent" | "body" | "checklistTitle" | "checklistNote" | "checklist">;
  about: Pick<HomeContent["about"], "title" | "accent" | "quoteLead" | "quoteRest" | "body"> & { imageAlt: string };
  quote: { titleLead: string; accent: string };
};

/** Dictionary (src/messages/<locale>.json → "content") for a non-English locale, or null for English. */
async function loadDict(locale: string): Promise<Dict | null> {
  if (locale === "en") return null;
  const messages = (await import(`../messages/${locale}.json`)).default as { content?: Dict };
  return messages.content ?? null;
}

// Sanity documents have their own _id, so match dictionary entries by the stable seed identity instead.
const seedServiceId = (slug: string) => seedHome.services.items.find((s) => s.slug === slug)?.id;
const seedIndustryId = (title: string) => seedHome.industries.items.find((i) => i.title === title)?.id;

export async function localizeSettings(s: SiteSettings, locale: string): Promise<SiteSettings> {
  const d = await loadDict(locale);
  return d ? { ...s, ...d.settings } : s;
}

/** Overlays dictionary text on the (English) home content. Images, slugs and ids are untouched. */
export async function localizeHome(h: HomeContent, locale: string): Promise<HomeContent> {
  const d = await loadDict(locale);
  if (!d) return h;
  return {
    ...h,
    hero: { ...h.hero, ...d.hero },
    marquee: d.marquee,
    services: {
      ...h.services,
      title: d.services.title,
      accent: d.services.accent,
      intro: d.services.intro,
      items: h.services.items.map((s) => {
        const t = d.services.items[seedServiceId(s.slug) ?? s.id];
        return t ? { ...s, ...t, image: { ...s.image, alt: t.imageAlt } } : s;
      }),
    },
    industries: {
      ...h.industries,
      title: d.industries.title,
      accent: d.industries.accent,
      intro: d.industries.intro,
      items: h.industries.items.map((i) => ({ ...i, ...d.industries.items[seedIndustryId(i.title) ?? i.id] })),
    },
    process: {
      ...h.process,
      title: d.process.title,
      accent: d.process.accent,
      titleEnd: d.process.titleEnd,
      steps: h.process.steps.map((s) => ({ ...s, ...d.process.steps[s.id] })),
    },
    safety: { ...h.safety, ...d.safety },
    about: { ...h.about, ...d.about, image: { ...h.about.image, alt: d.about.imageAlt } },
    quote: { ...h.quote, ...d.quote },
  };
}
