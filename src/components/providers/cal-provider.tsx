"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export const CAL_NAMESPACE = "consultation";

/** Initialises the Cal.com embed once. Any element with data-cal-link opens the booking modal. */
export function CalProvider({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#0B2239" },
          dark: { "cal-brand": "#FFB81C" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: () => window.dispatchEvent(new CustomEvent("om:booking-success")),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return null;
}
