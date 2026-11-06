"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { tokenize } from "@/lib/words";

type Props = {
  text: string;
  as?: "p" | "blockquote";
  className?: string;
  /** Words (by index) rendered in the muted tone at rest (e.g. second half of a quote). */
  mutedFrom?: number;
  mutedClassName?: string;
};

/**
 * A9/A10 · Scroll Reveal (ReactBits adapted): words go from opacity .1 + blur 4px to fully visible,
 * container straightens from 3° as you scroll. Screen readers get the sentence once via aria-label.
 */
export function ScrollRevealText({ text, as: Tag = "p", className, mutedFrom, mutedClassName }: Props) {
  const ref = useRef<HTMLElement>(null);
  const locale = useLocale();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as Record<string, boolean>;
          const targets = el.querySelectorAll<HTMLElement>("[data-word]");
          gsap.fromTo(
            el,
            { rotate: 3 },
            {
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            targets,
            { opacity: 0.1, filter: desktop ? "blur(4px)" : "blur(0px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              ease: "none",
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                start: "top bottom-=20%",
                end: "bottom center",
                scrub: true,
              },
            },
          );
        },
      );
    },
    { scope: ref },
  );

  let wordIndex = -1;
  const indexed = tokenize(text, locale).map((t) => ({ w: t.text, space: !t.word, idx: t.word ? ++wordIndex : wordIndex }));
  return (
    <Tag ref={ref as never} aria-label={text} className={cn("origin-left will-change-transform", className)}>
      {indexed.map(({ w, space, idx }, i) => {
        if (space) return w;
        const muted = mutedFrom !== undefined && idx >= mutedFrom;
        return (
          <span key={i} data-word aria-hidden="true" className={cn("inline-block", muted && mutedClassName)}>
            {w}
          </span>
        );
      })}
    </Tag>
  );
}
