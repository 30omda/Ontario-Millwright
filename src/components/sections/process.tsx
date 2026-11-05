"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CursorGrid } from "@/components/motion/cursor-grid";
import { GearTrainSvg } from "@/components/three/gear-train-svg";
import { SectionHeading } from "@/components/ui/section-heading";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollMotion } from "@/lib/scroll-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import type { HomeContent } from "@/content/types";

const GearTrainCanvas = dynamic(() => import("@/components/three/gear-train-canvas"), {
  ssr: false,
  loading: () => <GearTrainSvg animate={false} />,
});

type Mode = "svg" | "webgl";

/**
 * A7 · Process: pinned for ~3 viewports on desktop. Tracing beam fills as you scroll, each step
 * activates at 0/25/50/75 %, and the gear train turns with scroll velocity: down = forward, up = reverse.
 */
export function Process({ data }: { data: HomeContent["process"] }) {
  const root = useRef<HTMLElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const wide = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const lowPower = useSyncExternalStore(
    () => () => {},
    () => {
      const nav = navigator as Navigator & {
        connection?: { saveData?: boolean };
      };
      return (navigator.hardwareConcurrency ?? 4) < 4 || Boolean(nav.connection?.saveData);
    },
    () => true,
  );
  // WebGL only on capable desktops, loaded when the section is near the viewport.
  const mode: Mode = wide && !lowPower ? "webgl" : "svg";

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    if (figure.current) io.observe(figure.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const steps = data.steps.length;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          other: "(max-width: 1023.98px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as Record<string, boolean>;
          const beam = root.current!.querySelector<HTMLElement>("[data-beam]")!;
          const st = ScrollTrigger.create({
            trigger: desktop ? root.current : "[data-steps]",
            start: desktop ? "top top+=96" : "top 70%",
            end: desktop ? "+=300%" : "bottom 60%",
            pin: desktop,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollMotion.progress = self.progress;
              scrollMotion.velocity = self.getVelocity();
              scrollMotion.direction = self.direction === -1 ? -1 : 1;
              gsap.set(beam, { scaleY: self.progress });
              setActive(Math.min(steps - 1, Math.floor(self.progress * steps)));
            },
          });
          // Keep the gears responsive to scrolling anywhere near the section (not only while pinned).
          const ambient = ScrollTrigger.create({
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              if (st.isActive) return;
              scrollMotion.velocity = self.getVelocity();
              scrollMotion.direction = self.direction === -1 ? -1 : 1;
            },
          });
          return () => {
            st.kill();
            ambient.kill();
          };
        },
      );
    },
    { scope: root, dependencies: [data.steps.length] },
  );

  return (
    <section
      id="process"
      ref={root}
      aria-labelledby="process-title"
      className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26 lg:flex lg:min-h-[calc(100svh-96px)] lg:flex-col lg:justify-center lg:pt-10"
    >
      <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="process-title" lead={data.title} accent={data.accent} tail={data.titleEnd} />
      </div>
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <ol data-steps className="relative flex flex-col gap-3 pl-[34px]">
          <li aria-hidden="true" className="absolute top-3 bottom-3 left-2.5 w-0.5 bg-steel-200" />
          <li
            aria-hidden="true"
            data-beam
            className="absolute top-3 bottom-3 left-2.5 w-0.5 origin-top scale-y-0 bg-yellow-500 shadow-[0_0_10px_rgb(255_184_28/0.8)] motion-reduce:scale-y-100"
          />
          {data.steps.map((s, i) => {
            const state = i < active ? "done" : i === active ? "active" : "todo";
            return (
              <li
                key={s.id}
                aria-current={state === "active" ? "step" : undefined}
                className={cn(
                  "relative flex flex-col gap-2 rounded-[22px] border px-6 py-5.5 transition-[background-color,border-color,opacity] duration-500",
                  state === "active" ? "border-navy-900 bg-white" : "border-steel-200 bg-white/60",
                  state === "todo" && "lg:opacity-70",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-7 -left-[31px] size-3 rotate-45 border-2 border-navy-900 transition-colors duration-500",
                    state === "todo" ? "bg-white" : "bg-yellow-500",
                  )}
                />
                <span className="text-[21px] font-semibold tracking-[-0.02em] lg:text-[22px]">{s.title}</span>
                <span className="text-[15px] leading-relaxed text-ink-muted lg:text-sm">{s.description}</span>
              </li>
            );
          })}
        </ol>
        <div
          ref={figure}
          className="relative min-h-[340px] overflow-hidden rounded-[28px] md:min-h-[460px] lg:min-h-[560px]"
        >
          <div className="absolute inset-0 [mask-image:radial-gradient(closest-side,#000_55%,transparent_100%)]">
            <CursorGrid tone="light" />
          </div>
          <div className="pointer-events-none absolute inset-0 p-2 md:p-6">
            {mode === "webgl" && near ? <GearTrainCanvas /> : <GearTrainSvg />}
          </div>
        </div>
      </div>
    </section>
  );
}
