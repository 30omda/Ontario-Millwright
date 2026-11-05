/**
 * Involute spur-gear math shared by the SVG gear trains and the 3D gear train.
 * Module m (mm-ish units), pressure angle 20°.
 */
export const GEAR_MODULE = 6;
const PRESSURE_ANGLE = (20 * Math.PI) / 180;
const inv = (a: number) => Math.tan(a) - a;

export type GearSpec = { z: number; angleDeg: number };
export type PlacedGear = {
  z: number;
  x: number;
  y: number;
  phase: number;
  pitchRadius: number;
};

/** Points (x,y) of the gear outline centred on 0,0. */
export function gearOutline(z: number, m = GEAR_MODULE, rot = 0): Array<[number, number]> {
  const r = (z * m) / 2;
  const ra = r + m;
  const rf = r - 1.25 * m;
  const rb = r * Math.cos(PRESSURE_ANGLE);
  const step = (2 * Math.PI) / z;
  const r0 = Math.max(rb, rf);
  const psi = (R: number) =>
    Math.PI / (2 * z) + inv(PRESSURE_ANGLE) - inv(Math.acos(Math.min(1, rb / Math.max(R, rb))));
  const pts: Array<[number, number]> = [];
  const P = (R: number, a: number) => pts.push([R * Math.cos(a + rot), R * Math.sin(a + rot)]);
  for (let i = 0; i < z; i++) {
    const c = i * step;
    for (let k = 0; k <= 2; k++) P(rf, c - step / 2 + ((step / 2 - psi(r0)) * k) / 2);
    for (let k = 0; k <= 5; k++) {
      const R = r0 + ((ra - r0) * k) / 5;
      P(R, c - psi(R));
    }
    for (let k = 5; k >= 0; k--) {
      const R = r0 + ((ra - r0) * k) / 5;
      P(R, c + psi(R));
    }
    for (let k = 1; k <= 2; k++) P(rf, c + psi(r0) + ((step / 2 - psi(r0)) * k) / 2);
  }
  return pts;
}

const circlePath = (x: number, y: number, r: number) =>
  ` M${(x + r).toFixed(1)},${y.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(x - r).toFixed(1)},${y.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(x + r).toFixed(1)},${y.toFixed(1)}Z`;

/** SVG path (with bore + lightening holes) centred on 0,0. Use fill-rule="evenodd". */
export function gearPath(z: number, m = GEAR_MODULE): string {
  const r = (z * m) / 2;
  const rf = r - 1.25 * m;
  let d =
    "M" +
    gearOutline(z, m)
      .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
      .join("L") +
    "Z";
  d += circlePath(0, 0, r * 0.22);
  if (z >= 26) {
    const holes = 6;
    const rr = (r * 0.22 + rf) / 2;
    const hr = Math.min((rf - r * 0.22) * 0.3, r * 0.2);
    for (let i = 0; i < holes; i++) {
      const a = (i * 2 * Math.PI) / holes;
      d += circlePath(rr * Math.cos(a), rr * Math.sin(a), hr);
    }
  }
  return d;
}

/** Chain gears so each meshes with the previous one; returns centres + mesh phases. */
export function placeTrain(specs: GearSpec[], m = GEAR_MODULE): PlacedGear[] {
  const out: PlacedGear[] = [];
  specs.forEach((s, i) => {
    const prev = out[i - 1];
    if (!prev) {
      out.push({ z: s.z, x: 0, y: 0, phase: 0, pitchRadius: (s.z * m) / 2 });
      return;
    }
    const b = (s.angleDeg * Math.PI) / 180;
    const dist = ((prev.z + s.z) * m) / 2;
    const x = prev.x + Math.cos(b) * dist;
    const y = prev.y + Math.sin(b) * dist;
    const phase = (-prev.phase * prev.z) / s.z + b * (1 + prev.z / s.z) + Math.PI / s.z;
    out.push({ z: s.z, x, y, phase, pitchRadius: (s.z * m) / 2 });
  });
  return out;
}

/** Bounding box of a placed train (outer diameter + padding). */
export function trainBounds(train: PlacedGear[], m = GEAR_MODULE, pad = 12) {
  const minX = Math.min(...train.map((g) => g.x - g.pitchRadius - m)) - pad;
  const maxX = Math.max(...train.map((g) => g.x + g.pitchRadius + m)) + pad;
  const minY = Math.min(...train.map((g) => g.y - g.pitchRadius - m)) - pad;
  const maxY = Math.max(...train.map((g) => g.y + g.pitchRadius + m)) + pad;
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

/** Angular speed of gear i given the driver's speed (exact meshing, alternating direction). */
export function meshSpeed(train: PlacedGear[], i: number, driver = 1): number {
  let w = driver;
  for (let k = 1; k <= i; k++) w = (-w * train[k - 1]!.z) / train[k]!.z;
  return w;
}
