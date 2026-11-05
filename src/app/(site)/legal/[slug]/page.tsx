import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const PAGES = {
  privacy: { title: "Privacy policy" },
  accessibility: { title: "Accessibility" },
} as const;

type Slug = keyof typeof PAGES;

// Every slug is prerendered via generateStaticParams; awaiting params at the top keeps unknown slugs a real 404.
export const instant = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug as Slug];
  return page ? { title: page.title, robots: { index: false } } : {};
}

/** Placeholder until the client supplies the final legal copy (managed in Sanity as `page` documents). */
export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = PAGES[slug as Slug];
  if (!page) notFound();
  return (
    <section className="mx-auto max-w-[820px] px-4 pt-14 pb-10">
      <Link href="/" className={buttonVariants({ variant: "secondary", size: "md" })}>
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
      </Link>
      <h1 className="mt-8 text-[40px] leading-none font-bold tracking-[-0.045em] md:text-[56px]">{page.title}</h1>
      <p className="mt-6 text-base leading-relaxed text-ink-muted">
        [TBC] This page is waiting for the final text from Ontario Millwright.
      </p>
    </section>
  );
}
