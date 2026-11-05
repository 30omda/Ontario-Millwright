import {
  gearPath,
  meshSpeed,
  placeTrain,
  trainBounds,
  GEAR_MODULE,
} from "@/lib/gears";

const SPEC = [
  { z: 22, angleDeg: 0 },
  { z: 12, angleDeg: -32 },
  { z: 16, angleDeg: 28 },
];
const FILLS = ["#FFB81C", "#C9D1DA", "#2B4A6B"];
const BASE_SECONDS = 14; // driver: one revolution every 14s

/**
 * Three meshing gears rotated purely with CSS (no JS). Each gear's period ∝ its tooth count and the
 * direction alternates, so the teeth stay meshed. Hovering the parent `.group` doubles the speed.
 */
export function MiniGears({ className }: { className?: string }) {
  const train = placeTrain(SPEC);
  const b = trainBounds(train, GEAR_MODULE, 8);
  return (
    <svg
      viewBox={`${b.minX} ${b.minY} ${b.width} ${b.height}`}
      className={className}
      aria-hidden="true"
    >
      {train.map((g, i) => {
        const w = meshSpeed(train, i);
        const period = (BASE_SECONDS * Math.abs(1 / w)).toFixed(2);
        return (
          <g
            key={i}
            transform={`translate(${g.x.toFixed(1)} ${g.y.toFixed(1)})`}
          >
            <g
              className="motion-safe-spin animate-spin-gear [animation-play-state:var(--gear-state,running)] group-hover:[animation-duration:calc(var(--p)*0.5s)]"
              style={
                {
                  animationDuration: `${period}s`,
                  animationDirection: w > 0 ? "normal" : "reverse",
                  "--p": period,
                  transformOrigin: "0 0",
                } as React.CSSProperties
              }
            >
              <g
                transform={`rotate(${((g.phase * 180) / Math.PI).toFixed(2)})`}
              >
                <path
                  d={gearPath(g.z)}
                  fill={FILLS[i]}
                  fillRule="evenodd"
                  stroke="#0B2239"
                  strokeWidth={1.5}
                />
                <circle
                  r={(g.pitchRadius * 0.34).toFixed(1)}
                  fill="none"
                  stroke={i === 0 ? "#0B2239" : "#FFB81C"}
                  strokeWidth={3}
                />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
