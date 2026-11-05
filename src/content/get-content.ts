import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "@/sanity/client";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import { seedHome, seedSettings } from "./seed";
import type { HomeContent, Img, SiteSettings } from "./types";

type Raw = Record<string, unknown> | null;

const pick = <T>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || (Array.isArray(value) && value.length === 0) ? fallback : value;

const toPhoneHref = (phone: string) => `tel:+${phone.replace(/\D/g, "").replace(/^(?!1)/, "1")}`;

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");
  if (!client) return seedSettings;
  try {
    const s = (await client.fetch(SETTINGS_QUERY)) as Raw;
    if (!s) return seedSettings;
    const phone = pick(s.phone as string, seedSettings.phone);
    return {
      name: pick(s.name as string, seedSettings.name),
      tagline: pick(s.tagline as string, seedSettings.tagline),
      phone,
      phoneHref: toPhoneHref(phone),
      email: pick(s.email as string, seedSettings.email),
      whatsappNumber: (s.whatsappNumber as string) || null,
      serviceArea: pick(s.serviceArea as string, seedSettings.serviceArea),
      calLink: pick(s.calLink as string, seedSettings.calLink),
    };
  } catch {
    return seedSettings;
  }
}

/** Home content from Sanity, falling back field-by-field to the approved canvas copy. */
export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("home");
  if (!client) return seedHome;
  try {
    const data = (await client.fetch(HOME_QUERY)) as {
      page: Raw;
      services: HomeContent["services"]["items"];
      industries: HomeContent["industries"]["items"];
      projects: HomeContent["work"]["items"];
    };
    const p = data.page ?? {};
    const validImg = (i: Img | undefined) => Boolean(i?.src && i.width && i.height);
    return {
      ...seedHome,
      hero: {
        ...seedHome.hero,
        headline: pick(p.heroHeadline as string, seedHome.hero.headline),
        accent: pick(p.heroAccent as string, seedHome.hero.accent),
        subcopy: pick(p.heroSubcopy as string, seedHome.hero.subcopy),
        capabilities: pick(p.capabilities as HomeContent["hero"]["capabilities"], seedHome.hero.capabilities),
      },
      marquee: {
        rowA: pick(p.marqueeRowA as string[], seedHome.marquee.rowA),
        rowB: pick(p.marqueeRowB as string[], seedHome.marquee.rowB),
      },
      services: {
        ...seedHome.services,
        intro: pick(p.servicesIntro as string, seedHome.services.intro),
        items: data.services?.every((s) => validImg(s.image) && s.description && s.fullScope?.length)
          ? pick(data.services, seedHome.services.items)
          : seedHome.services.items,
      },
      industries: {
        ...seedHome.industries,
        intro: pick(p.industriesIntro as string, seedHome.industries.intro),
        items: pick(data.industries, seedHome.industries.items),
      },
      work: {
        ...seedHome.work,
        intro: pick(p.workIntro as string, seedHome.work.intro),
        items: data.projects?.every((s) => validImg(s.image))
          ? pick(data.projects, seedHome.work.items)
          : seedHome.work.items,
      },
      safety: {
        ...seedHome.safety,
        body: pick(p.safetyBody as string, seedHome.safety.body),
      },
      about: {
        ...seedHome.about,
        body: pick(p.aboutBody as string, seedHome.about.body),
      },
    };
  } catch {
    return seedHome;
  }
}

/** One service by slug (from the same cached home payload), or null. */
export async function getService(slug: string) {
  const home = await getHomeContent();
  const list = home.services.items;
  const index = list.findIndex((s) => s.slug === slug);
  if (index < 0) return null;
  return { service: list[index]!, others: list.filter((_, i) => i !== index), home };
}
