import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";
import { CAL_NAMESPACE } from "@/components/providers/cal-provider";

type Props = Omit<ComponentProps<"a">, "href" | "ref"> & { calLink: string };

/**
 * "Book a free consultation" CTA.
 * With a Cal.com link it is a button that opens the booking modal; without one it links to the
 * consultation card in the quote section.
 */
export function ConsultLink({ calLink, children, className, onClick, ...rest }: Props) {
  if (calLink) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick as unknown as ComponentProps<"button">["onClick"]}
        data-cal-namespace={CAL_NAMESPACE}
        data-cal-link={calLink}
        data-cal-config={JSON.stringify({ layout: "month_view", timeZone: "America/Toronto" })}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href="/#consult" className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
