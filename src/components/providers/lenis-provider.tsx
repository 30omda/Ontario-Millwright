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

    // Deep links (/#quote): pin spacers grow the page after the browser's hash jump, so re-jump
    // after every ScrollTrigger refresh until the user scrolls themselves (or 3s pass).
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const jump = () => {
      if (!target) return;
      instance.resize(); // Lenis caches its scroll limit
      instance.scrollTo(target, { offset: -96, immediate: true, force: true });
    };
    const stopJumping = () => ScrollTrigger.removeEventListener("refresh", jump);
    const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    let timer: number | undefined;
    if (target) {
      ScrollTrigger.addEventListener("refresh", jump);
      userEvents.forEach((e) => window.addEventListener(e, stopJumping, { once: true, passive: true }));
      timer = window.setTimeout(stopJumping, 3000);
      requestAnimationFrame(jump);
    }

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      stopJumping();
      window.clearTimeout(timer);
      userEvents.forEach((e) => window.removeEventListener(e, stopJumping));
      instance.destroy();
      current = null;
    };
  }, []);

  return <>{children}</>;
}
