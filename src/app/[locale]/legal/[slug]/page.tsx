import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { alternatesFor } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";

const SLUGS = ["privacy", "accessibility"] as const;

type Slug = (typeof SLUGS)[number];
const isSlug = (s: string): s is Slug => (SLUGS as readonly string[]).includes(s);

// Every slug is prerendered via generateStaticParams; awaiting params at the top keeps unknown slugs a real 404.
export const instant = false;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t(slug), robots: { index: false }, alternates: alternatesFor(locale as Locale, `/legal/${slug}`) };
}

/** Placeholder until the client supplies the final legal copy (managed in Sanity as `page` documents). */
export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!isSlug(slug)) notFound();
  const [t, tc] = await Promise.all([getTranslations("legal"), getTranslations("common")]);
  return (
    <section className="mx-auto max-w-[820px] px-4 pt-14 pb-10">
      <Link href="/" className={buttonVariants({ variant: "secondary", size: "md" })}>
        <ArrowLeft className="size-4" aria-hidden="true" /> {tc("backToHome")}
      </Link>
      <h1 className="mt-8 text-[40px] leading-none font-bold tracking-[-0.045em] md:text-[56px]">{t(slug)}</h1>
      <p className="mt-6 text-base leading-relaxed text-ink-muted">
        {t("placeholder")}
      </p>
    </section>
  );
}
