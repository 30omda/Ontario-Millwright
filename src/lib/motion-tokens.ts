/** Shared motion tokens (Build spec §3.5). Seconds for GSAP, ms helpers for CSS. */
export const motionTokens = {
  ease: {
    out: "power3.out",
    inOut: "power2.inOut",
    expo: "expo.out",
    back: "back.out(2)",
  },
  dur: { xs: 0.15, sm: 0.3, md: 0.6, lg: 0.9, xl: 1.2 },
  stagger: { tight: 0.04, base: 0.08, loose: 0.12 },
  distance: { sm: 16, md: 32, lg: 64 },
} as const;
