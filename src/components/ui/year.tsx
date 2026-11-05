"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year read on the client (server/prerender uses the fallback, keeping the shell static). */
export function Year({ fallback = 2026 }: { fallback?: number }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <span>{year}</span>;
}
