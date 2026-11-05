"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A8 · Spotlight hover: a radial yellow glow follows the pointer (CSS vars, no re-render). */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <article
      ref={ref}
      data-card
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[24px] border border-steel-200 bg-white transition-colors duration-300 hover:border-yellow-500",
        "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-100",
        "before:bg-[radial-gradient(260px_circle_at_var(--x,70%)_var(--y,30%),rgb(255_184_28/0.18),transparent_70%)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
