"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** CSS selector (inside this wrapper) for items revealed in a batch. */
  items?: string;
  /** Mask-reveal any [data-reveal-heading] inside. */
  headings?: boolean;
  y?: number;
  stagger?: number;
};

/**
 * Generic section reveal used by A5/A8/A9/A10/A11:
 * headings → masked line reveal, items → ScrollTrigger.batch fade-up.
 * SSR renders final state; GSAP sets "from" states on the client only.
 */
export function Reveal({ children, className, items, headings = true, y = 40, stagger = 0.08 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits: SplitText[] = [];
        if (headings) {
          gsap.utils.toArray<HTMLElement>("[data-reveal-heading]", root.current).forEach((h) => {
            const split = SplitText.create(h, {
              type: "lines",
              mask: "lines",
            });
            splits.push(split);
            gsap.from(split.lines, {
              yPercent: 105,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: h, start: "top 85%", once: true },
            });
          });
        }
        if (items) {
          const els = gsap.utils.toArray<HTMLElement>(items, root.current);
          gsap.set(els, { y, opacity: 0 });
          ScrollTrigger.batch(els, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out",
                stagger,
                overwrite: true,
              }),
          });
        }
        return () => splits.forEach((s) => s.revert());
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
