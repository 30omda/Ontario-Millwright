import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { alternatesFor } from "@/i18n/alternates";
import { HTML_LANG, type Locale } from "@/i18n/routing";
import { About } from "@/components/sections/about";
import { HeroVideo } from "@/components/sections/hero-video";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { QuoteSection } from "@/components/sections/quote/quote-section";
// Recent work is hidden for now; uncomment this import and <RecentWork /> below to bring it back.
// import { RecentWork } from "@/components/sections/recent-work";
import { Safety } from "@/components/sections/safety";
import { Services } from "@/components/sections/services";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { getHomeContent, getSettings } from "@/content/get-content";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale as Locale, "/") };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tm = await getTranslations("marquee");
  const tmeta = await getTranslations("meta");
  const [home, settings] = await Promise.all([getHomeContent(locale), getSettings(locale)]);
  const serviceOptions = home.services.items.map((s) => ({
    id: s.id,
    title: s.title,
  }));
  return (
    <>
      <JsonLd settings={settings} services={home.services.items} catalogName={tmeta("catalog")} lang={HTML_LANG[locale as Locale]} />
      <HeroVideo hero={home.hero} calLink={settings.calLink} />
      <VelocityMarquee
        label={tm("label")}
        rows={[
          {
            items: home.marquee.rowA,
            direction: -1,
            className: "text-navy-900",
          },
          {
            items: home.marquee.rowB,
            direction: 1,
            className: "text-steel-500",
          },
        ]}
      />
      <Services data={home.services} settings={settings} />
      <Industries data={home.industries} />
      <Process data={home.process} />
      {/* <RecentWork data={home.work} /> */}
      <Safety data={home.safety} />
      <About data={home.about} />
      <QuoteSection data={home.quote} services={serviceOptions} settings={settings} />
    </>
  );
}
