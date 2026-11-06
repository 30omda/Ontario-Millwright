import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "zh"],
  defaultLocale: "en",
  // English keeps the existing unprefixed URLs and deep links.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** BCP 47 tag for <html lang> and Open Graph. */
export const HTML_LANG: Record<Locale, string> = { en: "en-CA", fr: "fr-CA", zh: "zh-CN" };
