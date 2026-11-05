import type { MetadataRoute } from "next";
import { getHomeContent } from "@/content/get-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ontariomillwright.ca";
  const home = await getHomeContent();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...home.services.items.map((s) => ({
      url: `${base}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
