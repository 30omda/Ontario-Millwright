import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomeContent } from "@/content/types";

export function Safety({ data }: { data: HomeContent["safety"] }) {
  return (
    <section
      id="safety"
      aria-labelledby="safety-title"
      className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26"
    >
      <Reveal
        items="[data-check]"
        stagger={0.12}
        y={16}
        className="grid gap-3 lg:grid-cols-12"
      >
        <div className="rounded-[24px] bg-cream p-6 sm:p-[clamp(24px,4vw,44px)] lg:col-span-7">
          <SectionHeading
            id="safety-title"
            lead={data.title}
            accent={data.accent}
            className="lg:text-[clamp(40px,5vw,68px)]"
          />
          <ScrollRevealText
            text={data.body}
            className="mt-5 text-[15px] leading-relaxed text-ink-muted md:text-[17px]"
          />
        </div>
        <figure className="relative mx-auto w-full max-w-[460px] self-start overflow-hidden rounded-[24px] bg-navy-900 lg:col-span-5 lg:row-span-2 lg:max-w-none">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            sizes="(min-width: 1024px) 500px, 460px"
            className="h-auto w-full"
          />
        </figure>
        <div className="overflow-hidden rounded-[24px] border border-steel-200 bg-white lg:col-span-7">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 bg-navy-900 px-5 py-3.5 text-xs font-bold tracking-[0.08em] text-white uppercase">
            <span>{data.checklistTitle}</span>
            <span className="text-yellow-500">{data.checklistNote}</span>
          </div>
          <ul className="grid sm:grid-cols-2">
            {data.checklist.map((c, i) => (
              <li
                key={c.title}
                data-check
                className={`flex gap-3 px-5 py-4.5 ${i < 2 ? "border-b border-steel-100" : ""} ${i === 2 ? "border-b border-steel-100 sm:border-b-0" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-yellow-500"
                >
                  <Check className="size-3.5 text-navy-900" strokeWidth={3} />
                </span>
                <span>
                  <span className="block font-semibold">{c.title}</span>
                  <span className="block text-sm text-ink-soft">
                    {c.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
