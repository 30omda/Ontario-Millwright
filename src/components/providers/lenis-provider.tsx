"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let current: Lenis | null = null;
/** The active Lenis instance (null when reduced motion is on or before mount). */
export const getLenis = () => current;

/** Smooth scroll that drives GSAP ScrollTrigger. Disabled for prefers-reduced-motion. */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: { offset: -96 },
    });
    current = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      instance.destroy();
      current = null;
    };
  }, []);

  return <>{children}</>;
}
