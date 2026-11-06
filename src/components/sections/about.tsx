import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { countWords } from "@/lib/words";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { buttonVariants } from "@/components/ui/button";
import type { HomeContent } from "@/content/types";

export async function About({ data }: { data: HomeContent["about"] }) {
  const t = await getTranslations("about");
  const locale = await getLocale();
  // Chinese is written without spaces
  const quote = `${data.quoteLead}${locale === "zh" ? "" : " "}${data.quoteRest}`;
  const leadWords = countWords(data.quoteLead, locale);
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26">
      <Reveal className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2
            id="about-title"
            data-reveal-heading
            className="text-[36px] leading-[1.02] font-semibold tracking-[-0.04em] md:text-[48px] lg:text-[clamp(40px,5vw,68px)] lg:leading-[0.98] lg:tracking-[-0.05em]"
          >
            {data.title} <span className="text-steel-500">{data.accent}</span>
          </h2>
          <div className="relative mt-9 pl-5">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-[3px] bg-yellow-500" />
            <ScrollRevealText
              as="blockquote"
              text={quote}
              mutedFrom={leadWords}
              mutedClassName="text-steel-400"
              className="text-2xl leading-[1.2] font-medium tracking-[-0.02em] text-navy-900 md:text-[30px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="h-auto w-full rounded-[24px]"
          />
          <p className="text-[15px] leading-[1.7] text-ink-muted md:text-base">{data.body}</p>
          <Link href="/#quote" className={`${buttonVariants({ variant: "secondary", size: "lg" })} self-start`}>
            {t("cta")} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
