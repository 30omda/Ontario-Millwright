import Image from "next/image";
import { ArrowRight, CircleHelp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ConsultLink } from "@/components/ui/consult-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { MiniGears } from "@/components/motion/mini-gears";
import { Reveal } from "@/components/motion/reveal";
import type { HomeContent, Service, SiteSettings } from "@/content/types";
import { cn } from "@/lib/utils";

function ServiceCard({ s }: { s: Service }) {
  return (
    <article
      data-card
      className="group flex flex-col overflow-hidden rounded-[24px] border border-steel-200 bg-white transition-[box-shadow,border-color] duration-300 hover:border-yellow-500 hover:shadow-(--shadow-glow)"
    >
      <div className="px-2.5 pt-2.5">
        <div className="overflow-hidden rounded-2xl bg-steel-100">
          <Image
            src={s.image.src}
            alt={s.image.alt}
            width={s.image.width}
            height={s.image.height}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full transition-transform duration-500 ease-(--ease-smooth) group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="flex grow flex-col gap-2.5 px-5 pt-4.5 pb-5.5">
        <h3 className="text-[21px] leading-[1.1] font-semibold tracking-[-0.03em] lg:text-2xl">
          {s.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-ink-muted lg:text-sm">
          {s.summary}
        </p>
        <ul
          className="mt-1.5 flex flex-wrap gap-1.5"
          aria-label={`${s.title} scope`}
        >
          {s.scope.map((x) => (
            <li
              key={x}
              className="rounded-full border border-steel-200 bg-[#f5f7f9] px-2.5 py-1.5 text-xs font-medium text-ink-muted"
            >
              {x}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <a
            href={`/?service=${s.id}#quote`}
            className={buttonVariants({ variant: "dark", size: "sm" })}
          >
            Request this service{" "}
            <ArrowRight
              className="size-3.5 text-yellow-500"
              aria-hidden="true"
            />
          </a>
          <a
            href={`/services/${s.slug}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "min-h-0 py-1 text-[13px]",
            )}
          >
            View service
          </a>
        </div>
      </div>
    </article>
  );
}

export function Services({
  data,
  settings,
}: {
  data: HomeContent["services"];
  settings: SiteSettings;
}) {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="mx-auto max-w-[1240px] px-4 pt-16 md:pt-26"
    >
      <Reveal items="[data-card]">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="services-title"
            lead={data.title}
            accent={data.accent}
          />
          <p className="max-w-[400px] text-[15px] leading-relaxed text-ink-muted md:text-base">
            {data.intro}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
          <article
            data-card
            className="group flex flex-col gap-3.5 rounded-[24px] bg-navy-900 px-6.5 py-7 text-white"
            style={{ "--gear-state": "running" } as React.CSSProperties}
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-yellow-500">
              <CircleHelp
                className="size-[22px] text-navy-900"
                aria-hidden="true"
              />
            </span>
            <h3 className="text-[28px] leading-[1.05] font-semibold tracking-[-0.03em]">
              Not sure which service you need?
            </h3>
            <p className="text-[15px] leading-relaxed text-on-navy">
              Tell us what the machine is doing. A millwright will walk through
              it with you and point you to the right crew.
            </p>
            <div className="-mx-6.5 my-1 flex min-h-[170px] grow items-center justify-center">
              <MiniGears className="h-full max-h-[260px] w-full overflow-visible" />
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2.5">
              <ConsultLink
                calLink={settings.calLink}
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                Book a free consultation
              </ConsultLink>
              <a
                href={settings.phoneHref}
                className="border-b-2 border-yellow-500 py-1 text-sm font-medium text-white"
              >
                {settings.phone}
              </a>
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
