"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Row = { items: string[]; direction: 1 | -1; className?: string };

function GearMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-6 shrink-0 fill-yellow-500 md:size-[34px]"
    >
      <path d="M12 2l1.6 2.6 3-.7.7 3 2.6 1.6-1.4 2.7 1.4 2.7-2.6 1.6-.7 3-3-.7L12 22l-1.6-2.6-3 .7-.7-3-2.6-1.6L5.5 12 4.1 9.3l2.6-1.6.7-3 3 .7z" />
      <circle cx="12" cy="12" r="3.2" className="fill-page" />
    </svg>
  );
}

/**
 * A4 · Scroll-velocity marquee (ReactBits "Scroll Velocity" adapted).
 * Each row loops at rest; scroll velocity boosts speed; scrolling up reverses direction.
 */
export function VelocityMarquee({ rows, label }: { rows: Row[]; label: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root.current);
        const loops = tracks.map((el, i) => {
          const dir = rows[i]?.direction ?? 1;
          return gsap.fromTo(
            el,
            { xPercent: dir > 0 ? -50 : 0 },
            {
              xPercent: dir > 0 ? 0 : -50,
              duration: 40,
              ease: "none",
              repeat: -1,
            },
          );
        });
        let scrollDir = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            scrollDir = self.direction;
            const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
            loops.forEach((t) => {
              gsap.to(t, {
                timeScale: scrollDir * (1 + Math.abs(boost)),
                duration: 0.2,
                overwrite: true,
              });
              gsap.to(t, { timeScale: scrollDir, duration: 0.8, delay: 0.2 });
            });
          },
        });
        const hoverIn = () => loops.forEach((t) => gsap.to(t, { timeScale: 0.3 * scrollDir, duration: 0.4 }));
        const hoverOut = () => loops.forEach((t) => gsap.to(t, { timeScale: scrollDir, duration: 0.4 }));
        const node = root.current!;
        if (window.matchMedia("(hover: hover)").matches) {
          node.addEventListener("pointerenter", hoverIn);
          node.addEventListener("pointerleave", hoverOut);
        }
        return () => {
          st.kill();
          node.removeEventListener("pointerenter", hoverIn);
          node.removeEventListener("pointerleave", hoverOut);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={label} className="mt-16 overflow-hidden border-y border-steel-200 py-4 md:mt-24">
      {rows.map((row, i) => (
        <div key={i} className="overflow-hidden py-1.5 whitespace-nowrap md:py-2.5" aria-hidden={i > 0}>
          <div
            data-track
            className={cn(
              "inline-flex items-center gap-5 text-[44px] leading-none font-semibold tracking-[-0.045em] will-change-transform md:gap-9 md:text-[64px] lg:text-[84px]",
              row.className,
            )}
          >
            {[...row.items, ...row.items].map((t, k) => (
              <span key={k} className="inline-flex items-center gap-5 md:gap-9" aria-hidden={k >= row.items.length}>
                {t}
                <GearMark />
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
