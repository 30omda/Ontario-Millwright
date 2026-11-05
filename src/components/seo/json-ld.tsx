import type { Service, SiteSettings } from "@/content/types";

/** LocalBusiness + services structured data. */
export function JsonLd({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.name,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    areaServed: { "@type": "State", name: "Ontario" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Millwright services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
        },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
