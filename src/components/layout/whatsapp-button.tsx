"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Floating chat button. Fades out while the quote section is on screen so it never covers the form
 * (the form has its own WhatsApp hand-off).
 */
export function WhatsAppButton({ number }: { number: string | null }) {
  const t = useTranslations("whatsapp");
  const [overForm, setOverForm] = useState(false);

  useEffect(() => {
    const quote = document.getElementById("quote");
    if (!quote) return;
    const io = new IntersectionObserver(([e]) => setOverForm(Boolean(e?.isIntersecting)), { threshold: 0.05 });
    io.observe(quote);
    return () => io.disconnect();
  }, []);

  const href = buildWhatsAppUrl(number);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("chat")}
      aria-hidden={overForm || undefined}
      tabIndex={overForm ? -1 : undefined}
      className={cn(
        "group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-12px_rgb(11_34_57/0.6)] transition-[transform,opacity] duration-200 hover:scale-105 motion-safe:animate-[om-pop_0.5s_var(--ease-smooth)_0.6s_both] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:right-6 sm:bottom-6",
        overForm && "pointer-events-none opacity-0",
      )}
    >
      <WhatsAppIcon className="size-7" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-navy-900 px-3.5 py-2 text-sm font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
      >
        {t("tooltip")}
      </span>
    </a>
  );
}
