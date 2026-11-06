"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Inline SVG flags: emoji flags do not render on Windows.
const FLAGS: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
    </>
  ),
  fr: (
    <>
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </>
  ),
  zh: (
    <>
      <rect width="60" height="40" fill="#DE2910" />
      <path
        fill="#FFDE00"
        d="M10 5l2.1 6.5H19l-5.5 4 2.1 6.5L10 18l-5.6 4 2.1-6.5L1 11.5h6.9zM22 3l.9 2.2 2.3.1-1.8 1.5.6 2.3L22 7.8l-2 1.3.6-2.3-1.8-1.5 2.3-.1zM26 9l.9 2.2 2.3.1-1.8 1.5.6 2.3L26 13.8l-2 1.3.6-2.3-1.8-1.5 2.3-.1zM26 17l.9 2.2 2.3.1-1.8 1.5.6 2.3L26 21.8l-2 1.3.6-2.3-1.8-1.5 2.3-.1zM22 23l.9 2.2 2.3.1-1.8 1.5.6 2.3L22 27.8l-2 1.3.6-2.3-1.8-1.5 2.3-.1z"
        transform="translate(0 2) scale(1 1)"
      />
    </>
  ),
};

// Native names, so a visitor can always find their own language.
const NAMES: Record<Locale, string> = { en: "English", fr: "Français", zh: "中文" };

function Flag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("size-5 shrink-0 rounded-full ring-1 ring-navy-900/15", className)}
    >
      {FLAGS[locale]}
    </svg>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    // Keep the current page, query string and #section.
    const { search, hash } = window.location;
    startTransition(() => router.replace(`${pathname}${search}${hash}`, { locale: next }));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={`${t("language")}: ${NAMES[locale]}`}
        className={cn(
          "inline-flex h-11 items-center gap-1.5 rounded-full border border-steel-200 bg-white pr-2.5 pl-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900",
          className,
        )}
      >
        <Flag locale={locale} />
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[70] min-w-44 rounded-[18px] border border-steel-200 bg-white p-1.5 shadow-(--shadow-taped)"
        >
          <ul aria-label={t("language")}>
            {routing.locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  lang={l}
                  aria-current={l === locale ? "true" : undefined}
                  onClick={() => choose(l)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium text-navy-900 transition-colors hover:bg-steel-50"
                >
                  <Flag locale={l} className="size-6" />
                  <span className="grow">{NAMES[l]}</span>
                  {l === locale ? <Check className="size-4 text-yellow-700" aria-hidden="true" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
