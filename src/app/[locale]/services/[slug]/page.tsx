import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Phone } from "lucide-react";
import { CursorGrid } from "@/components/motion/cursor-grid";
import { MiniGears } from "@/components/motion/mini-gears";
import { alternatesFor } from "@/i18n/alternates";
import { HTML_LANG, type Locale } from "@/i18n/routing";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import { getHomeContent, getService, getSettings } from "@/content/get-content";
import { cn } from "@/lib/utils";

// Every slug is prerendered via generateStaticParams; awaiting params at the top keeps unknown slugs a real 404.
export const instant = false;

export async function generateStaticParams() {
  const home = await getHomeContent("en");
  return home.services.items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [data, t] = await Promise.all([getService(slug, locale), getTranslations({ locale, namespace: "servicePage" })]);
  if (!data) return {};
  const { service } = data;
  return {
    title: t("titleSuffix", { service: service.title }),
    description: service.description.slice(0, 158),
    alternates: alternatesFor(locale as Locale, `/services/${service.slug}`),
    openGraph: { title: service.title, description: service.summary, images: [{ url: service.image.src }] },
  };
}

const sectionTitle =
  "text-[32px] leading-[1.02] font-semibold tracking-[-0.04em] md:text-[44px] lg:text-[clamp(40px,4.4vw,60px)] lg:leading-[0.98] lg:tracking-[-0.05em]";

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicePage");
  const tc = await getTranslations("common");
  const [data, settings] = await Promise.all([getService(slug, locale), getSettings(locale)]);
  if (!data) notFound();
  const { service, others, home } = data;
  const requestHref = `/?service=${service.id}#quote`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    inLanguage: HTML_LANG[locale as Locale],
    name: service.title,
    description: service.description,
    serviceType: service.title,
    areaServed: { "@type": "State", name: "Ontario" },
    provider: { "@type": "LocalBusiness", name: settings.name, telephone: settings.phone, email: settings.email },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("scopeJsonLd", { service: service.title }),
      itemListElement: service.fullScope.map((x) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: x },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ── Intro ── */}
      <section aria-labelledby="service-title" className="mx-auto max-w-[1240px] px-4 pt-10 md:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "md" }), "pl-4")}>
            <ArrowLeft className="size-4" aria-hidden="true" /> {tc("backToHome")}
          </Link>
          <nav aria-label={t("breadcrumb")} className="text-sm text-ink-soft">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-navy-900">
                  {t("home")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#services" className="hover:text-navy-900">
                  {t("services")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-navy-900">
                {service.title}
              </li>
            </ol>
          </nav>
        </div>

        <Reveal className="mt-8 grid items-center gap-8 lg:mt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <h1
              id="service-title"
              data-reveal-heading
              className="text-[40px] leading-[0.98] font-bold tracking-[-0.05em] text-navy-900 md:text-[56px] lg:text-[clamp(56px,5.6vw,80px)]"
            >
              {service.title}
            </h1>
            <p className="mt-6 max-w-[580px] text-base leading-relaxed text-ink-muted md:text-lg">
              {service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultLink
                calLink={settings.calLink}
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "font-bold")}
              >
                <CalendarDays className="size-[18px]" aria-hidden="true" /> {tc("bookConsultation")}
              </ConsultLink>
              <Link href={requestHref} className={buttonVariants({ variant: "dark", size: "lg" })}>
                {tc("requestThisService")} <ArrowRight className="size-4 text-yellow-500" aria-hidden="true" />
              </Link>
            </div>
            <a
              href={settings.phoneHref}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-navy-900"
            >
              <Phone className="size-4 text-yellow-700" aria-hidden="true" />
              {t("emergencyCall", { phone: settings.phone })}
            </a>
          </div>
          <figure className="relative m-0 rounded-[28px] border border-steel-200 bg-white p-2.5 shadow-(--shadow-taped)">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              width={service.image.width}
              height={service.image.height}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full rounded-[20px]"
            />
            <span
              aria-hidden="true"
              className="absolute top-6 left-6 size-7 border-t-[3px] border-l-[3px] border-yellow-500"
            />
            <span
              aria-hidden="true"
              className="absolute right-6 bottom-6 size-7 border-r-[3px] border-b-[3px] border-yellow-500"
            />
          </figure>
        </Reveal>
      </section>

      {/* ── Scope of work ── */}
      <section aria-labelledby="scope-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-24">
        <Reveal items="[data-scope]" stagger={0.06} y={24}>
          <div className="rounded-[28px] border border-steel-200 bg-white p-6 sm:p-[clamp(28px,4vw,48px)]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 id="scope-title" data-reveal-heading className={sectionTitle}>
                {t("scopeLead")} <span className="text-steel-500">{t("scopeAccent")}</span>
              </h2>
              <p className="max-w-[380px] text-[15px] leading-relaxed text-ink-muted">
                {t("scopeSub", { service: service.title })}
              </p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {service.fullScope.map((item) => (
                <li
                  key={item}
                  data-scope
                  className="flex items-center gap-3 rounded-2xl bg-steel-50 px-4 py-4 text-[15px] font-semibold text-navy-900"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-yellow-500"
                  >
                    <Check className="size-4 text-navy-900" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ── How the job runs ── */}
      <section aria-labelledby="steps-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-24">
        <Reveal items="[data-step]" stagger={0.08}>
          <h2 id="steps-title" data-reveal-heading className={cn(sectionTitle, "mb-8")}>
            {t("stepsLead")} <span className="text-steel-500">{t("stepsAccent")}</span>
          </h2>
          <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {home.process.steps.map((s, i) => (
              <li
                key={s.id}
                data-step
                className="relative flex flex-col gap-2 rounded-[22px] border border-steel-200 bg-white px-5.5 pt-5 pb-6"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="size-3 rotate-45 border-2 border-navy-900 bg-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{t("step", { n: i + 1 })}</span>
                </span>
                <span className="text-xl font-semibold tracking-[-0.02em]">{s.title}</span>
                <span className="text-[15px] leading-relaxed text-ink-muted lg:text-sm">{s.description}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ── Industries + safety (navy) ── */}
      <section aria-labelledby="industries-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-24">
        <div className="relative overflow-hidden rounded-[28px] bg-navy-900 text-white">
          <CursorGrid tone="dark" />
          <Reveal
            items="[data-chip]"
            stagger={0.04}
            y={12}
            className="relative grid gap-10 p-7 md:p-[clamp(28px,5vw,56px)] lg:grid-cols-2"
          >
            <div>
              <h2 id="industries-title" data-reveal-heading className={cn(sectionTitle, "text-white")}>
                {t("industriesLead")} <span className="text-yellow-500">{t("industriesAccent")}</span>
              </h2>
              <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-[#c5d0db] md:text-base">
                {home.industries.intro}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {home.industries.items.map((i) => (
                  <li
                    key={i.id}
                    data-chip
                    className="rounded-full border border-[#2a4763] bg-navy-950/60 px-4 py-2 text-sm font-medium"
                  >
                    {i.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[22px] border border-[#2a4763] bg-navy-950/60 p-6">
              <p className="text-xs font-bold tracking-[0.08em] text-yellow-500 uppercase">{t("safetyHeading")}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-on-navy">{home.safety.body}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {home.safety.checklist.map((c) => (
                  <li key={c.title} data-chip className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-md bg-yellow-500"
                    >
                      <Check className="size-3.5 text-navy-900" strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block font-semibold">{c.title}</span>
                      <span className="block text-sm text-on-navy-soft">{c.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Other services ── */}
      <section aria-labelledby="others-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-24">
        <Reveal items="[data-card]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="others-title" data-reveal-heading className={sectionTitle}>
              {t("otherLead")} <span className="text-steel-500">{t("otherAccent")}</span>
            </h2>
            <Link href="/#services" className={cn(buttonVariants({ variant: "link" }), "min-h-0 py-1")}>
              {t("allServices")}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/services/${o.slug}`}
                data-card
                className="group flex flex-col overflow-hidden rounded-[24px] border border-steel-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-yellow-500 hover:shadow-(--shadow-glow)"
              >
                <span className="block px-2.5 pt-2.5">
                  <span className="block overflow-hidden rounded-2xl bg-steel-100">
                    <Image
                      src={o.image.src}
                      alt={o.image.alt}
                      width={o.image.width}
                      height={o.image.height}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                </span>
                <span className="flex grow flex-col gap-2 px-5 pt-4 pb-5">
                  <span className="text-lg leading-tight font-semibold tracking-[-0.02em]">{o.title}</span>
                  <span className="text-sm leading-relaxed text-ink-muted">{o.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-navy-900">
                    {tc("viewService")}
                    <ArrowRight
                      className="size-4 text-yellow-700 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Final CTA ── */}
      <section aria-labelledby="cta-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-24">
        <div className="group grid items-center gap-6 overflow-hidden rounded-[28px] bg-navy-900 p-7 text-white md:p-[clamp(28px,5vw,56px)] lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="cta-title" className={cn(sectionTitle, "text-white")}>
              Talk it through <span className="text-yellow-500">before you commit.</span>
            </h2>
            <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-on-navy md:text-base">
              Book a free 30-minute consultation. A millwright will look at the job with you and tell you what it takes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ConsultLink
                calLink={settings.calLink}
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "font-bold")}
              >
                <CalendarDays className="size-[18px]" aria-hidden="true" /> {tc("bookConsultation")}
              </ConsultLink>
              <Link href="/" className={buttonVariants({ variant: "ghostDark", size: "lg" })}>
                <ArrowLeft className="size-4" aria-hidden="true" /> {tc("backToHome")}
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[340px]">
            <MiniGears className="h-auto w-full overflow-visible" />
          </div>
        </div>
      </section>
    </>
  );
}
