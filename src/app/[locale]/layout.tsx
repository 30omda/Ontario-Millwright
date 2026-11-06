import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Noto_Sans_SC } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Navbar } from "@/components/layout/navbar";
import { CalProvider } from "@/components/providers/cal-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { getHomeContent, getSettings } from "@/content/get-content";
import { HTML_LANG, routing } from "@/i18n/routing";
import "../globals.css";

// Only applied on /zh (see globals.css). No preload: the CJK font is large, so it loads on demand.
const notoSC = Noto_Sans_SC({ variable: "--font-noto-sc", weight: ["400", "500", "600", "700", "800"], preload: false, display: "swap" });

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ontariomillwright.ca"),
    title: {
      default: `Ontario Millwright | ${t("title")}`,
      template: "%s | Ontario Millwright",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: t("ogLocale"),
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => (l === "en" ? "en_CA" : l === "fr" ? "fr_CA" : "zh_CN")),
      siteName: "Ontario Millwright",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B2239",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");
  // Only the namespaces used by client components are sent to the browser.
  const { nav, common, hero, quote, whatsapp } = await getMessages();
  const [settings, home] = await Promise.all([getSettings(locale), getHomeContent(locale)]);
  return (
    <html lang={HTML_LANG[locale]} className={`${GeistSans.variable} ${locale === "zh" ? notoSC.variable : ""} antialiased`}>
      <body>
        <NextIntlClientProvider messages={{ nav, common, hero, quote, whatsapp }}>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only z-[100] rounded-full bg-yellow-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {t("skipToContent")}
            </a>
            <CalProvider enabled={Boolean(settings.calLink)} />
            <div className="min-h-svh overflow-x-clip bg-blueprint">
              <Navbar name={settings.name} phone={settings.phone} phoneHref={settings.phoneHref} calLink={settings.calLink} />
              <main id="main">{children}</main>
              <Footer settings={settings} services={home.services.items} />
            </div>
            <WhatsAppButton number={settings.whatsappNumber} />
            <Toaster position="bottom-center" richColors closeButton />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
