"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** A12 · Footer card rises, tapes "stick" with a small overshoot, columns stagger in. */
export function FooterReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            once: true,
          },
        });
        tl.from("[data-footer-card]", {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
          .from(
            "[data-tape]",
            {
              scale: 1.2,
              opacity: 0,
              duration: 0.5,
              ease: "back.out(2)",
              stagger: 0.08,
            },
            "-=0.3",
          )
          .from(
            "[data-footer-col]",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.06 },
            "-=0.4",
          );
      });
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
