import { CursorGrid } from "@/components/motion/cursor-grid";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomeContent } from "@/content/types";

export function Industries({ data }: { data: HomeContent["industries"] }) {
  return (
    <section
      id="industries"
      aria-labelledby="industries-title"
      className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26"
    >
      <div
        data-industries-block
        className="relative overflow-hidden rounded-[28px] bg-navy-900 text-white"
      >
        <CursorGrid tone="dark" />
        <Reveal
          items="[data-tile]"
          stagger={0.05}
          y={24}
          className="relative p-7 md:p-[clamp(28px,5vw,56px)]"
        >
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="industries-title"
              lead={data.title}
              accent={data.accent}
              dark
            />
            <p className="max-w-[420px] text-[15px] leading-relaxed text-[#c5d0db] md:text-base">
              {data.intro}
            </p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((i) => (
              <li
                key={i.id}
                data-tile
                className="group flex flex-col gap-1.5 rounded-[18px] border border-[#2a4763] bg-navy-950/60 px-5 py-4.5 transition-colors duration-300 hover:border-yellow-500"
              >
                <span className="text-[19px] font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1">
                  {i.title}
                </span>
                <span className="text-[13px] text-on-navy-soft">
                  {i.description}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
