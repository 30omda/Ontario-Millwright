import Image from "next/image";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import type { HomeContent, SiteSettings } from "@/content/types";
import { QuoteForm } from "./quote-form";

type Props = {
  data: HomeContent["quote"];
  services: Array<{ id: string; title: string }>;
  settings: SiteSettings;
};

export function QuoteSection({ data, services, settings }: Props) {
  const whatsapp = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}`
    : null;
  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26"
    >
      <Reveal className="grid items-stretch gap-4 rounded-[24px] border border-steel-200 bg-white p-2 sm:rounded-[32px] sm:p-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3.5 px-3 pt-5 pb-4 sm:px-6 sm:pt-7 sm:pb-6">
          <p className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <MapPin className="size-4" aria-hidden="true" />
            Serving plants across Ontario
            <a
              href={settings.phoneHref}
              className="ml-1 font-medium text-yellow-700"
            >
              Emergency? {settings.phone}
            </a>
          </p>
          <h2
            id="quote-title"
            data-reveal-heading
            className="mt-1 mb-2.5 text-[36px] leading-none font-semibold tracking-[-0.045em] sm:text-[clamp(36px,4.2vw,56px)]"
          >
            {data.titleLead}{" "}
            <span className="text-steel-500">{data.accent}</span>
          </h2>
          <QuoteForm
            services={services}
            calLink={settings.calLink}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>

        <figure className="m-0 flex flex-col gap-2.5 self-start rounded-[24px] bg-navy-900 p-2.5">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            sizes="(min-width: 1024px) 580px, 100vw"
            className="h-auto w-full rounded-[18px]"
          />
          <div
            id="consult"
            className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-white px-5 py-4.5"
          >
            <span>
              <span className="block text-[19px] font-semibold tracking-[-0.02em]">
                Free 30-minute consultation
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                Talk through the job before you commit.
              </span>
            </span>
            <ConsultLink
              calLink={settings.calLink}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Book a time
            </ConsultLink>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <a
              href={`mailto:${settings.email}`}
              className="rounded-2xl border border-white/25 bg-white/14 px-4 py-3.5 text-sm break-all text-white backdrop-blur-[10px]"
            >
              <span className="block text-xs font-semibold text-yellow-500">
                Email
              </span>
              {settings.email}
            </a>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/25 bg-white/14 px-4 py-3.5 text-sm text-white backdrop-blur-[10px]"
              >
                <span className="block text-xs font-semibold text-yellow-500">
                  WhatsApp
                </span>
                Message us
              </a>
            ) : (
              <span className="rounded-2xl border border-white/25 bg-white/14 px-4 py-3.5 text-sm text-white/80">
                <span className="block text-xs font-semibold text-yellow-500">
                  WhatsApp
                </span>
                Number coming soon
              </span>
            )}
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
