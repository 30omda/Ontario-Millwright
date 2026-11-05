"use client";

import { useEffect, useMemo, useRef } from "react";
import { gearPath, meshSpeed, placeTrain, trainBounds } from "@/lib/gears";
import { driverSpeed, GEAR_FILLS, GEAR_TRAIN_SPEC, scrollMotion } from "@/lib/scroll-motion";

/** 2D fallback of the gear train (mobile, reduced motion, low-power). Same math as the 3D version. */
export function GearTrainSvg({ animate = true }: { animate?: boolean }) {
  const train = useMemo(() => placeTrain(GEAR_TRAIN_SPEC), []);
  const b = trainBounds(train);
  const paths = useMemo(() => train.map((g) => gearPath(g.z)), [train]);
  const groups = useRef<Array<SVGGElement | null>>([]);

  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let angle = 0;
    let last = performance.now();
    let raf = 0;
    let visible = false;
    const svg = groups.current[0]?.ownerSVGElement;
    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    if (svg) io.observe(svg);
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      angle += driverSpeed() * dt;
      scrollMotion.velocity *= 0.92; // inertia decay when scrolling stops
      train.forEach((g, i) => {
        const a = ((angle * meshSpeed(train, i) + g.phase) * 180) / Math.PI;
        groups.current[i]?.setAttribute("transform", `translate(${g.x} ${g.y}) rotate(${a.toFixed(2)})`);
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [animate, train]);

  return (
    <svg
      viewBox={`${b.minX} ${b.minY} ${b.width} ${b.height}`}
      role="img"
      aria-label="Seven meshing gears that turn forward when you scroll down and reverse when you scroll up"
      className="size-full"
    >
      {train.map((g, i) => (
        <g
          key={i}
          ref={(el) => {
            groups.current[i] = el;
          }}
          transform={`translate(${g.x} ${g.y}) rotate(${((g.phase * 180) / Math.PI).toFixed(2)})`}
        >
          <path d={paths[i]} fill={GEAR_FILLS[i]} fillRule="evenodd" stroke="#0B2239" strokeWidth={1.2} />
          <circle
            r={(g.pitchRadius * 0.34).toFixed(1)}
            fill="none"
            stroke={i === 4 ? "#0B2239" : "#FFB81C"}
            strokeWidth={3}
          />
        </g>
      ))}
    </svg>
  );
}
