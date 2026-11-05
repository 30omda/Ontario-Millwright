"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Menu, Phone, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import { LogoMark } from "@/components/ui/logo";
import { Tape } from "@/components/ui/tape";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#process", label: "Process" },
  { href: "#work", label: "Work" },
  { href: "#safety", label: "Safety" },
  { href: "#about", label: "About" },
] as const;

type Props = {
  name: string;
  phone: string;
  phoneHref: string;
  calLink: string;
};

/**
 * Taped white card navbar (A3): compacts after 80px, hides on fast downward scroll,
 * reappears on any upward scroll. Never hides while the mobile menu is open.
 */
export function Navbar({ name, phone, phoneHref, calLink }: Props) {
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
          compact
            ? "py-2 pr-2 shadow-[0_18px_40px_-22px_rgb(11_34_57/0.55)]"
            : "py-2.5 pr-2.5 shadow-(--shadow-nav)",
        )}
      >
        <Tape side="left" width={70} />
        <Tape side="right" width={70} />

        <a href="#top" className="flex items-center gap-2.5 text-navy-900">
          <LogoMark />
          <span className="text-base font-semibold tracking-[-0.02em]">
            {name}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-5 text-[15px] font-medium xl:gap-6.5 nav:flex"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-navy-900 transition-colors hover:text-yellow-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ConsultLink
            calLink={calLink}
            className={cn(
              buttonVariants({ variant: "info", size: "md" }),
              "hidden nav:inline-flex",
            )}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            Free consultation
          </ConsultLink>
          <a
            href={phoneHref}
            className="hidden px-3.5 py-3 text-[15px] font-semibold text-navy-900 xl:inline-block"
          >
            {phone}
          </a>
          <a
            href="#quote"
            className={cn(
              buttonVariants({ variant: "dark", size: "md" }),
              "hidden sm:inline-flex",
            )}
          >
            Request a Quote{" "}
            <ArrowUpRight
              className="size-4 text-yellow-500"
              aria-hidden="true"
            />
          </a>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="inline-flex size-11 items-center justify-center rounded-full border border-steel-200 bg-white text-navy-900 nav:hidden"
              aria-label="Open menu"
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
                          <LogoMark /> {name}
                        </Dialog.Title>
                        <Dialog.Close
                          className="inline-flex size-11 items-center justify-center rounded-full border border-steel-200"
                          aria-label="Close menu"
                        >
                          <X className="size-5" aria-hidden="true" />
                        </Dialog.Close>
                      </div>
                      <Dialog.Description className="sr-only">
                        Site navigation
                      </Dialog.Description>
                      <nav aria-label="Mobile" className="mt-4 flex flex-col">
                        {NAV_LINKS.map((l, i) => (
                          <motion.a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="border-b border-steel-100 py-3.5 text-lg font-semibold text-navy-900"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.04 }}
                          >
                            {l.label}
                          </motion.a>
                        ))}
                      </nav>
                      <div className="mt-5 grid gap-2.5">
                        <ConsultLink
                          calLink={calLink}
                          onClick={() => setOpen(false)}
                          className={cn(
                            buttonVariants({ variant: "primary", size: "lg" }),
                          )}
                        >
                          <CalendarDays
                            className="size-[18px]"
                            aria-hidden="true"
                          />{" "}
                          Book a free consultation
                        </ConsultLink>
                        <a
                          href="#quote"
                          onClick={() => setOpen(false)}
                          className={buttonVariants({
                            variant: "dark",
                            size: "lg",
                          })}
                        >
                          Request a Quote
                        </a>
                        <a
                          href={phoneHref}
                          className={buttonVariants({
                            variant: "secondary",
                            size: "lg",
                          })}
                        >
                          <Phone className="size-4" aria-hidden="true" />{" "}
                          {phone}
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
