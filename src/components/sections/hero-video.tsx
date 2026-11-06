"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Pause, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useMediaQuery } from "@/lib/use-media-query";
import type { HomeContent } from "@/content/types";

type Props = { hero: HomeContent["hero"]; calLink: string; whatsappNumber: string | null };

const FRAME_MAX = 1180; // px, width of the rounded frame before it expands

/**
 * A1 (page-load intro) + A2 (scroll-expand: rounded frame → full-bleed).
 * The frame is a clip-path on a full-viewport media layer, so expanding never causes layout/reflow.
 */
export function HeroVideo({ hero, calLink, whatsappNumber }: Props) {
  const tw = useTranslations("whatsapp");
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber);
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userPaused, setPaused] = useState(false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const paused = userPaused || reduceMotion;

  // Pause when off-screen / reduced motion; resume when visible (unless the user paused).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduceMotion) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !v.dataset.userPaused) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduceMotion]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.userPaused;
      v.muted = true;
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.dataset.userPaused = "1";
      v.pause();
      setPaused(true);
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, mobile, reduce } = ctx.conditions as Record<string, boolean>;
          const frame = root.current!.querySelector<HTMLElement>("[data-hero-frame]")!;
          const media = root.current!.querySelector<HTMLElement>("[data-hero-media]")!;
          const corners = root.current!.querySelectorAll<HTMLElement>("[data-hero-corner]");

          if (reduce) {
            gsap.set(frame, { clipPath: "inset(0px 0px 0px 0px round 0px)" });
            gsap.set(corners, { opacity: 0 });
            return;
          }

          // ── A1: intro ──
          const h1 = root.current!.querySelector<HTMLElement>("[data-hero-title]")!;
          // autoSplit re-splits on resize / font load, so line breaks never go stale
          const split = SplitText.create(h1, {
            type: "words,lines",
            mask: "lines",
            linesClass: "pb-[0.06em]",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                opacity: 0,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.06,
                delay: 0.15,
              }),
          });
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from("[data-hero-sub]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.6)
            .from(
              "[data-hero-cap]",
              {
                y: 32,
                opacity: 0,
                filter: "blur(6px)",
                duration: 0.7,
                stagger: 0.08,
              },
              "-=0.35",
            );

          // ── A2: scroll-expand ──
          const startClip = () => {
            const vw = window.innerWidth;
            const side = desktop ? Math.max(16, (vw - FRAME_MAX) / 2) : 12;
            const top = desktop ? 96 : 84;
            const bottom = desktop ? 16 : 12;
            return `inset(${top}px ${side}px ${bottom}px ${side}px round ${desktop ? 28 : 22}px)`;
          };

          gsap.set(frame, { clipPath: startClip() });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=60%" : "40% top",
              scrub: 0.6,
              pin: desktop,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(frame, { clipPath: startClip }, { clipPath: "inset(0px 0px 0px 0px round 0px)" }, 0)
            .fromTo(media, { scale: 1.08 }, { scale: 1 }, 0)
            .to(corners, { opacity: 0, duration: 0.4 }, 0);

          if (mobile) ScrollTrigger.refresh();
          return () => split.revert();
        },
      );
    },
    { scope: root },
  );

  const { capabilities, video } = hero;

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className="relative -mt-[84px] h-svh min-h-[680px] overflow-hidden text-white md:min-h-[760px]"
    >
      {/* Media layer clipped into a rounded frame that expands to full-bleed */}
      <div
        data-hero-frame
        className="absolute inset-0 overflow-hidden bg-navy-950 [clip-path:inset(84px_12px_12px_12px_round_22px)] motion-reduce:[clip-path:none] md:[clip-path:inset(96px_max(16px,calc((100%-1180px)/2))_16px_max(16px,calc((100%-1180px)/2))_round_28px)]"
      >
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <video
            ref={videoRef}
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={video.poster}
            aria-label={t("videoLabel")}
          >
            <source src={video.mp4_720} type="video/mp4" media="(max-width: 768px)" />
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4_1080} type="video/mp4" />
          </video>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(7_22_39/0.88)_0%,rgb(7_22_39/0.62)_45%,rgb(7_22_39/0.2)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_22_39/0.35)_0%,transparent_30%,transparent_60%,rgb(7_22_39/0.7)_100%)]"
        />
        <span
          data-hero-corner
          aria-hidden="true"
          className="absolute top-[116px] left-[max(36px,calc((100%-1180px)/2+20px))] hidden size-[30px] border-t-[3px] border-l-[3px] border-yellow-500 md:block"
        />
        <span
          data-hero-corner
          aria-hidden="true"
          className="absolute top-[116px] right-[max(36px,calc((100%-1180px)/2+20px))] hidden size-[30px] border-t-[3px] border-r-[3px] border-yellow-500 md:block"
        />

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 pb-6 sm:px-[clamp(24px,5vw,64px)] sm:pb-[clamp(24px,4vw,48px)] md:gap-7">
            <div>
              <h1
                id="hero-title"
                data-hero-title
                className="text-[44px] leading-[0.95] font-extrabold tracking-[-0.055em] [text-shadow:0_2px_24px_rgb(7_22_39/0.45)] sm:text-[clamp(56px,min(7.6vw,13svh),112px)] sm:leading-[0.92]"
              >
                {hero.headline} <span className="text-yellow-500">{hero.accent}</span>
              </h1>
              <p
                data-hero-sub
                className="mt-6 max-w-[560px] text-base leading-relaxed font-medium text-white/92 sm:text-[19px]"
              >
                {hero.subcopy}
              </p>
              <div data-hero-sub className="mt-8 flex flex-wrap gap-3">
                <ConsultLink
                  calLink={calLink}
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }), "font-bold")}
                >
                  <CalendarDays className="size-[18px]" aria-hidden="true" />
                  {tc("bookConsultation")}
                </ConsultLink>
                <Link
                  href="/#quote"
                  className={buttonVariants({
                    variant: "ghostDark",
                    size: "lg",
                  })}
                >
                  {tc("requestQuote")}
                </Link>
              </div>
              {whatsappUrl ? (
                <p
                  data-hero-sub
                  className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85 [@media(max-height:720px)]:hidden"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline-offset-4 hover:underline"
                  >
                    <WhatsAppIcon className="size-5 text-[#25D366]" />
                    {tw("chat")}
                  </a>
                  <span className="hidden sm:inline">{tw("heroSub")}</span>
                </p>
              ) : null}
            </div>
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-2.5">
              {capabilities.map((c) => (
                <li
                  key={c.title}
                  data-hero-cap
                  className={cn(
                    "rounded-[18px] px-4 py-3.5 sm:px-4.5 sm:py-4",
                    c.highlight
                      ? "bg-yellow-500 text-navy-950"
                      : "border border-white/22 bg-white/12 backdrop-blur-[14px]",
                  )}
                >
                  <p className="text-[15px] font-bold sm:text-[17px]">{c.title}</p>
                  <p className={cn("text-[13px]", c.highlight ? "text-yellow-900" : "text-white/80")}>
                    {c.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          aria-label={paused ? t("play") : t("pause")}
          className="absolute top-[100px] right-[max(24px,calc((100%-1180px)/2+64px))] z-20 flex size-11 items-center justify-center rounded-full border border-white/45 bg-navy-950/55 text-white backdrop-blur md:top-[124px]"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
