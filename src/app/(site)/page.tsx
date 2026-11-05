import { About } from "@/components/sections/about";
import { HeroVideo } from "@/components/sections/hero-video";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { QuoteSection } from "@/components/sections/quote/quote-section";
import { RecentWork } from "@/components/sections/recent-work";
import { Safety } from "@/components/sections/safety";
import { Services } from "@/components/sections/services";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { getHomeContent, getSettings } from "@/content/get-content";
import { JsonLd } from "@/components/seo/json-ld";

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomeContent(), getSettings()]);
  const serviceOptions = home.services.items.map((s) => ({
    id: s.id,
    title: s.title,
  }));
  return (
    <>
      <JsonLd settings={settings} services={home.services.items} />
      <HeroVideo hero={home.hero} calLink={settings.calLink} />
      <VelocityMarquee
        label="Services and industries"
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
      <RecentWork data={home.work} />
      <Safety data={home.safety} />
      <About data={home.about} />
      <QuoteSection data={home.quote} services={serviceOptions} settings={settings} />
    </>
  );
}
