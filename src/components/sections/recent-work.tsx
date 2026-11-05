import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomeContent } from "@/content/types";

export function RecentWork({ data }: { data: HomeContent["work"] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26">
      <Reveal items="[data-card]" stagger={0.1}>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="work-title" lead={data.title} accent={data.accent} />
          <p className="max-w-[400px] text-[15px] leading-relaxed text-ink-muted md:text-base">{data.intro}</p>
        </div>
        <div className={`grid gap-3 md:grid-cols-2 ${data.items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
          {data.items.map((p) => (
            <SpotlightCard key={p.id}>
              <div className="relative z-10 overflow-hidden bg-steel-100">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="relative z-10 flex grow flex-col gap-2.5 px-6 pt-5.5 pb-6">
                <span className="text-xs font-bold tracking-[0.08em] text-yellow-700 uppercase">{p.category}</span>
                <h3 className="text-[21px] font-semibold tracking-[-0.02em] lg:text-[22px]">{p.title}</h3>
                <p className="grow text-[15px] leading-relaxed text-ink-muted lg:text-sm">{p.summary}</p>
                <dl className="mt-1.5 grid grid-cols-2 gap-2">
                  {p.details.map((d) => (
                    <div key={d.label} className="rounded-xl bg-[#f5f7f9] px-3.5 py-3">
                      <dt className="text-[11px] font-bold tracking-[0.08em] text-yellow-700 uppercase">{d.label}</dt>
                      <dd className="mt-1 text-sm leading-snug font-medium text-navy-900">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
