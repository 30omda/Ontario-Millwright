import type { MetadataRoute } from "next";
import { getHomeContent } from "@/content/get-content";
import { getPathname } from "@/i18n/navigation";
import { HTML_LANG, routing } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ontariomillwright.ca";

/** One entry per locale for a path, each listing all language versions (hreflang). */
function entries(path: string, priority: number): MetadataRoute.Sitemap {
  const url = (locale: (typeof routing.locales)[number]) => {
    const p = getPathname({ href: path, locale });
    return p === "/" ? base : `${base}${p}`;
  };
  const languages = Object.fromEntries(routing.locales.map((l) => [HTML_LANG[l], url(l)]));
  return routing.locales.map((l) => ({
    url: url(l),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home = await getHomeContent("en");
  return [...entries("/", 1), ...home.services.items.flatMap((s) => entries(`/services/${s.slug}`, 0.8))];
}
