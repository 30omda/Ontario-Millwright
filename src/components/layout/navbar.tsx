"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Menu, Phone, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/ui/logo";
import { Tape } from "@/components/ui/tape";
import { cn } from "@/lib/utils";

// Labels live in messages/<locale>.json under "nav".
export const NAV_LINKS = [
  { href: "/#services", key: "services" },
  { href: "/#industries", key: "industries" },
  { href: "/#process", key: "process" },
  // { href: "/#work", key: "work" }, // Recent work section is hidden
  { href: "/#safety", key: "safety" },
  { href: "/#about", key: "about" },
] as const;

const MotionLink = motion.create(Link);

type Props = {
  name: string;
  phone: string;
  phoneHref: string;
  phone2: string;
  phone2Href: string;
  calLink: string;
};

/**
 * Taped white card navbar (A3): compacts after 80px, hides on fast downward scroll,
 * reappears on any upward scroll. Never hides while the mobile menu is open.
 */
export function Navbar({ name, phone, phoneHref, phone2, phone2Href, calLink }: Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  // French labels are long: the consultation button waits for the wider breakpoint
  const fr = useLocale() === "fr";
  const consultShow = fr ? "hidden xl:inline-flex" : "hidden nav:inline-flex";
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef({ y: 0, t: 0 });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - last.current.y;
      const v = (dy / Math.max(1, t - last.current.t)) * 1000; // px/s
      setCompact(y > 80);
      if (dy < 0 || y < 120) setHidden(false);
      else if (v > 800) setHidden(true);
      last.current = { y, t };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-4 z-50 px-4 transition-transform duration-500 ease-(--ease-smooth) motion-reduce:transition-none",
        hidden && !open && "-translate-y-[130%]",
      )}
    >
      <header
        data-navbar
        className={cn(
          "relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 rounded-[22px] border border-steel-200 bg-white pl-5 transition-[padding,box-shadow] duration-300",
          compact ? "py-2 pr-2 shadow-[0_18px_40px_-22px_rgb(11_34_57/0.55)]" : "py-2.5 pr-2.5 shadow-(--shadow-nav)",
        )}
      >
        <Tape side="left" width={70} />
        <Tape side="right" width={70} />

        <Link href="/#top" className="flex items-center">
          <Logo name={name} />
        </Link>

        <nav aria-label={t("primary")} className="hidden items-center gap-5 text-[15px] font-medium nav:flex xl:gap-6.5">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-navy-900 transition-colors hover:text-yellow-700">
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ConsultLink
            calLink={calLink}
            className={cn(buttonVariants({ variant: "info", size: "md" }), consultShow)}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            {tc("freeConsultation")}
          </ConsultLink>
          <div className={cn("hidden flex-col px-3.5 text-[13px] leading-tight font-semibold text-navy-900", !fr && "xl:flex")}>
            <a href={phoneHref}>{phone}</a>
            <a href={phone2Href}>{phone2}</a>
          </div>
          <Link href="/#quote" className={cn(buttonVariants({ variant: "dark", size: "md" }), "hidden sm:inline-flex")}>
            {t("quote")} <ArrowUpRight className="size-4 text-yellow-500" aria-hidden="true" />
          </Link>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="inline-flex size-11 items-center justify-center rounded-full border border-steel-200 bg-white text-navy-900 nav:hidden"
              aria-label={t("openMenu")}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Dialog.Trigger>
            <AnimatePresence>
              {open ? (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <motion.div
                      className="fixed inset-0 z-[60] bg-navy-950/40 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount>
                    <motion.div
                      className="fixed inset-x-3 top-3 z-[61] rounded-[24px] border border-steel-200 bg-white p-5 shadow-(--shadow-taped)"
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="flex items-center gap-2.5 font-semibold text-navy-900">
                          <Logo name={name} />
                        </Dialog.Title>
                        <Dialog.Close
                          className="inline-flex size-11 items-center justify-center rounded-full border border-steel-200"
                          aria-label={t("closeMenu")}
                        >
                          <X className="size-5" aria-hidden="true" />
                        </Dialog.Close>
                      </div>
                      <Dialog.Description className="sr-only">{t("siteNav")}</Dialog.Description>
                      <nav aria-label={t("mobile")} className="mt-4 flex flex-col">
                        {NAV_LINKS.map((l, i) => (
                          <MotionLink
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="border-b border-steel-100 py-3.5 text-lg font-semibold text-navy-900"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                          >
                            {t(l.key)}
                          </MotionLink>
                        ))}
                      </nav>
                      <div className="mt-5 grid gap-2.5">
                        <ConsultLink
                          calLink={calLink}
                          onClick={() => setOpen(false)}
                          className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
                        >
                          <CalendarDays className="size-[18px]" aria-hidden="true" /> {tc("bookConsultation")}
                        </ConsultLink>
                        <Link
                          href="/#quote"
                          onClick={() => setOpen(false)}
                          className={buttonVariants({
                            variant: "dark",
                            size: "lg",
                          })}
                        >
                          {tc("requestQuote")}
                        </Link>
                        <a
                          href={phoneHref}
                          className={buttonVariants({
                            variant: "secondary",
                            size: "lg",
                          })}
                        >
                          <Phone className="size-4" aria-hidden="true" /> {phone}
                        </a>
                        <a
                          href={phone2Href}
                          className={buttonVariants({
                            variant: "secondary",
                            size: "lg",
                          })}
                        >
                          <Phone className="size-4" aria-hidden="true" /> {phone2}
                        </a>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              ) : null}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </header>
    </div>
  );
}
