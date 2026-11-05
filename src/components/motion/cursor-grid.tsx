"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** "dark" for the navy Industries block, "light" for the Process figure. */
  tone: "dark" | "light";
  cell?: number;
  className?: string;
};

/**
 * A6 · Cursor grid (ReactBits "Cursor Grid" adapted).
 * One canvas; cells under the pointer light up yellow and fade (~600ms trail), soft glow follows the
 * pointer, click spawns a square pulse. Runs only while visible; static grid on touch / reduced motion.
 */
export function CursorGrid({ tone, cell = 32, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const interactive = !reduce && canHover;
    const line =
      tone === "dark" ? "rgba(255,255,255,0.07)" : "rgba(11,34,57,0.09)";
    const hitAlpha = tone === "dark" ? 0.55 : 0.62;
    const FADE = 600;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const hits = new Map<string, number>();
    const pulses: Array<{ x: number; y: number; t: number }> = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = false;

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (pointer && interactive) {
        const g = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          Math.max(w, h) * 0.35,
        );
        g.addColorStop(0, `rgba(255,184,28,${tone === "dark" ? 0.16 : 0.12})`);
        g.addColorStop(1, "rgba(255,184,28,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      for (const [key, t] of hits) {
        const age = now - t;
        if (age > FADE) {
          hits.delete(key);
          continue;
        }
        const [cx, cy] = key.split(":").map(Number) as [number, number];
        ctx.fillStyle = `rgba(255,184,28,${(hitAlpha * Math.pow(1 - age / FADE, 1.6)).toFixed(3)})`;
        ctx.fillRect(cx * cell + 0.5, cy * cell + 0.5, cell - 1, cell - 1);
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!;
        const k = (now - p.t) / 400;
        if (k >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const size = cell * (1 + 2 * k);
        ctx.strokeStyle = `rgba(255,184,28,${(0.6 * (1 - k)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0.5; x <= w; x += cell) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0.5; y <= h; y += cell) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    const loop = (now: number) => {
      draw(now);
      raf =
        visible && (hits.size > 0 || pulses.length > 0 || pointer)
          ? requestAnimationFrame(loop)
          : 0;
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      hits.set(
        `${Math.floor(pointer.x / cell)}:${Math.floor(pointer.y / cell)}`,
        performance.now(),
      );
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const cx = Math.floor((e.clientX - r.left) / cell) * cell + cell / 2;
      const cy = Math.floor((e.clientY - r.top) / cell) * cell + cell / 2;
      pulses.push({ x: cx, y: cy, t: performance.now() });
      kick();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) kick();
    });
    io.observe(host);
    if (interactive) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
    }
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [tone, cell]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0"}
    />
  );
}
