/**
 * Tiny mutable store shared by the Process ScrollTrigger and the gear renderers (SVG + WebGL).
 * Mutated every scroll tick without re-rendering React.
 */
export const scrollMotion = {
  /** px/s, signed (positive = scrolling down) */
  velocity: 0,
  /** 1 = down / forward, -1 = up / reverse */
  direction: 1 as 1 | -1,
  /** 0..1 progress through the pinned Process section */
  progress: 0,
};

/** Driver angular speed in rad/s: idle base + scroll boost, signed by direction. */
export function driverSpeed(): number {
  const boost = Math.min(Math.abs(scrollMotion.velocity) / 900, 6);
  return scrollMotion.direction * (0.25 + boost);
}

export const GEAR_TRAIN_SPEC = [
  { z: 44, angleDeg: 0 },
  { z: 20, angleDeg: -25 },
  { z: 32, angleDeg: 30 },
  { z: 16, angleDeg: -40 },
  { z: 38, angleDeg: 40 },
  { z: 18, angleDeg: 110 },
  { z: 30, angleDeg: 150 },
];
export const GEAR_FILLS = [
  "#1B3A61",
  "#C9D1DA",
  "#1B3A61",
  "#C9D1DA",
  "#FFB81C",
  "#1B3A61",
  "#C9D1DA",
];
