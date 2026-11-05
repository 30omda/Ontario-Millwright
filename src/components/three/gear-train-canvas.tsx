"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { gearOutline, meshSpeed, placeTrain, trainBounds, GEAR_MODULE } from "@/lib/gears";
import { driverSpeed, GEAR_FILLS, GEAR_TRAIN_SPEC, scrollMotion } from "@/lib/scroll-motion";

const SCALE = 0.0046; // gear units → world units

function useGearGeometry(z: number) {
  return useMemo(() => {
    const pts = gearOutline(z, GEAR_MODULE);
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const r = (z * GEAR_MODULE) / 2;
    const bore = new THREE.Path();
    bore.absarc(0, 0, r * 0.22, 0, Math.PI * 2, true);
    shape.holes.push(bore);
    if (z >= 26) {
      const rf = r - 1.25 * GEAR_MODULE;
      const rr = (r * 0.22 + rf) / 2;
      const hr = Math.min((rf - r * 0.22) * 0.3, r * 0.2);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        const h = new THREE.Path();
        h.absarc(rr * Math.cos(a), rr * Math.sin(a), hr, 0, Math.PI * 2, true);
        shape.holes.push(h);
      }
    }
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 14 + z * 0.15,
      bevelEnabled: true,
      bevelThickness: 1.2,
      bevelSize: 0.8,
      bevelSegments: 2,
      curveSegments: 24,
    });
    geo.center();
    return geo;
  }, [z]);
}

function Gear({ z, color, index }: { z: number; color: string; index: number }) {
  const geo = useGearGeometry(z);
  return (
    <mesh geometry={geo} castShadow receiveShadow userData={{ index }}>
      <meshStandardMaterial
        color={color}
        metalness={color === "#FFB81C" ? 0.35 : 0.6}
        roughness={color === "#FFB81C" ? 0.45 : 0.32}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}

function Train() {
  const train = useMemo(() => placeTrain(GEAR_TRAIN_SPEC), []);
  const b = trainBounds(train);
  const cx = b.minX + b.width / 2;
  const cy = b.minY + b.height / 2;
  const refs = useRef<Array<THREE.Group | null>>([]);
  const laser = useRef<THREE.Mesh>(null);
  const root = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const g0 = train[0]!;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const p = scrollMotion.progress;
    // Commission step (last quarter) runs the train up to speed.
    const runUp = p > 0.75 ? 1 + 2 * ((p - 0.75) / 0.25) : 1;
    angle.current += driverSpeed() * runUp * d;
    scrollMotion.velocity = THREE.MathUtils.damp(scrollMotion.velocity, 0, 4, d);
    train.forEach((g, i) => {
      const grp = refs.current[i];
      if (grp) grp.rotation.z = angle.current * meshSpeed(train, i) + g.phase;
    });
    // Set & Align step (0.5–0.75): laser draws from the left edge to the coupling.
    if (laser.current) {
      const k = THREE.MathUtils.clamp((p - 0.5) / 0.2, 0, 1);
      laser.current.scale.x = Math.max(k, 0.0001);
      (laser.current.material as THREE.MeshBasicMaterial).opacity = k > 0 ? 0.95 : 0;
    }
    // Camera story: wide survey → closer as the job progresses, tiny orbit.
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, -0.6 + p * 0.9, 3, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 0.5 - p * 0.4, 3, d);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 6.4 - p * 1.3, 3, d);
    cam.lookAt(0, 0, 0);
    if (root.current) root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.18 + p * 0.3, 3, d);
  });

  const laserGeo = useMemo(() => {
    const len = g0.x - b.minX - g0.pitchRadius * 0.42;
    const geo = new THREE.BoxGeometry(len, 3, 3);
    geo.translate(len / 2, 0, 0);
    return geo;
  }, [g0, b.minX]);

  return (
    <group ref={root} scale={SCALE}>
      <group position={[-cx, cy, 0]} rotation={[Math.PI, 0, 0]}>
        {train.map((g, i) => (
          <group
            key={i}
            position={[g.x, g.y, 0]}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            <Gear z={g.z} color={GEAR_FILLS[i]!} index={i} />
          </group>
        ))}
        {/* coupling + shaft on the driver gear */}
        <mesh position={[g0.x, g0.y, -26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[g0.pitchRadius * 0.42, g0.pitchRadius * 0.42, 22, 48]} />
          <meshStandardMaterial color="#FFB81C" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[g0.x, g0.y, -60]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[g0.pitchRadius * 0.2, g0.pitchRadius * 0.2, 70, 32]} />
          <meshStandardMaterial color="#C9D1DA" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* laser alignment line: anchored at the left edge, grows toward the coupling */}
        <mesh ref={laser} position={[b.minX, g0.y, -30]} geometry={laserGeo}>
          <meshBasicMaterial color="#FFB81C" transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** A7 · 3D gear train driven by scroll velocity/direction (desktop only, lazy-loaded). */
export default function GearTrainCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [-0.6, 0.5, 6.4], fov: 32 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        alpha: true,
      }}
      aria-label="3D gear train that turns forward when you scroll down and reverses when you scroll up"
      role="img"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <Train />
      <ContactShadows position={[0, -1.7, 0]} opacity={0.3} scale={10} blur={2.6} far={3} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer
          intensity={0.8}
          color="#FFB81C"
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[3, 1, 1]}
        />
      </Environment>
    </Canvas>
  );
}
