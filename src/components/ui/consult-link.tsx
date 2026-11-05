import type { ComponentProps } from "react";
import { CAL_NAMESPACE } from "@/components/providers/cal-provider";

type Props = Omit<ComponentProps<"a">, "href"> & { calLink: string };

/**
 * "Book a free consultation" anchor. With a Cal.com link it opens the booking modal
 * (progressive enhancement: without JS it still goes to the quote section).
 */
export function ConsultLink({ calLink, children, ...props }: Props) {
  const calProps = calLink
    ? {
        "data-cal-namespace": CAL_NAMESPACE,
        "data-cal-link": calLink,
        "data-cal-config": JSON.stringify({
          layout: "month_view",
          timeZone: "America/Toronto",
        }),
      }
    : {};
  return (
    <a href="#consult" {...calProps} {...props}>
      {children}
    </a>
  );
}
