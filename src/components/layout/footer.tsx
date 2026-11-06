import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ConsultLink } from "@/components/ui/consult-link";
import { Logo } from "@/components/ui/logo";
import { Tape } from "@/components/ui/tape";
import type { Service, SiteSettings } from "@/content/types";
import { FooterReveal } from "@/components/motion/footer-reveal";
import { Year } from "@/components/ui/year";

const COMPANY = [
  { href: "/#industries", key: "industries" },
  { href: "/#process", key: "howWeWork" },
  // { href: "/#work", label: "Recent work" }, // section is hidden
  { href: "/#safety", key: "safety" },
  { href: "/#about", key: "about" },
] as const;

const headingCls = "mb-4 text-[13px] font-bold tracking-[0.08em] text-yellow-700 uppercase";
const linkCls = "text-[15px] font-medium text-ink-muted transition-colors hover:text-navy-900";

export async function Footer({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const whatsapp = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null;
  return (
    <footer className="mx-auto max-w-[1240px] px-4 pt-16 pb-6 md:pt-26">
      <FooterReveal>
        <div
          data-footer-card
          className="relative rounded-[28px] border border-steel-200 bg-white px-5 py-7 shadow-(--shadow-taped) sm:p-[clamp(32px,5vw,56px)]"
        >
          <Tape side="left" />
          <Tape side="right" />
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-[minmax(240px,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-x-8 lg:gap-y-10">
            <div data-footer-col className="col-span-2 flex flex-col items-start gap-3.5 md:col-span-3 lg:col-span-1">
              <Link href="/#top" className="inline-flex items-center">
                <Logo name={settings.name} className="h-16 sm:h-20" />
              </Link>
              <p className="max-w-80 text-base leading-relaxed text-ink-soft">{settings.tagline}</p>
              <a
                href={settings.phoneHref}
                className="mt-1.5 inline-flex items-center gap-3 rounded-2xl bg-navy-900 py-3 pr-4.5 pl-3.5 text-white"
              >
                <span className="flex size-[34px] items-center justify-center rounded-[10px] bg-yellow-500">
                  <Phone className="size-[17px] text-navy-900" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-yellow-500">{t("emergencyLine")}</span>
                  <span className="block text-xl font-semibold tracking-[-0.02em]">{settings.phone}</span>
                </span>
              </a>
            </div>
            <nav aria-label={t("services")} data-footer-col>
              <p className={headingCls}>{t("services")}</p>
              <ul className="flex flex-col gap-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className={linkCls}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={t("company")} data-footer-col>
              <p className={headingCls}>{t("company")}</p>
              <ul className="flex flex-col gap-3">
                {COMPANY.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.key === "howWeWork" ? t("howWeWork") : tn(l.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div
              data-footer-col
              className="col-span-2 border-t border-steel-100 pt-6 md:col-span-1 md:border-0 md:pt-0"
            >
              <p className={headingCls}>{t("getInTouch")}</p>
              <ul className="flex flex-col gap-3.5 text-[15px] font-medium">
                <li>
                  <ConsultLink
                    calLink={settings.calLink}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-blue-800"
                  >
                    <CalendarDays className="size-4" aria-hidden="true" /> {tc("freeConsultation")}
                  </ConsultLink>
                </li>
                <li>
                  <Link href="/#quote" className={linkCls}>
                    {t("requestQuote")}
                  </Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="size-[18px] text-yellow-700" aria-hidden="true" />
                  <a href={`mailto:${settings.email}`} className={`${linkCls} break-all sm:break-normal`}>
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="size-[18px] text-yellow-700" aria-hidden="true" />
                  {whatsapp ? (
                    <a href={whatsapp} className={linkCls} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  ) : (
                    <span className="text-ink-soft">{t("whatsappTbc")}</span>
                  )}
                </li>
                <li className="flex items-center gap-2.5 text-ink-muted">
                  <MapPin className="size-[18px] text-yellow-700" aria-hidden="true" />
                  {settings.serviceArea}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 px-2 pt-5 text-sm text-ink-soft sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>{t.rich("rights", { year: () => <Year />, name: settings.name })}</span>
            <Link href="/legal/privacy" className="hover:text-navy-900">
              {t("privacy")}
            </Link>
            <Link href="/legal/accessibility" className="hover:text-navy-900">
              {t("accessibility")}
            </Link>
          </div>
          <Link href="/#top" className="font-semibold text-navy-900">
            {tc("backToTop")}
          </Link>
        </div>
      </FooterReveal>
    </footer>
  );
}
