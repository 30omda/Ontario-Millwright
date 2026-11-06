import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { HTML_LANG, routing, type Locale } from "./routing";

/** Canonical + hreflang links for a page. `path` is the unprefixed path, e.g. "/" or "/services/x". */
export function alternatesFor(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  const url = (l: Locale) => getPathname({ href: path, locale: l });
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [HTML_LANG[l], url(l)])),
      "x-default": url(routing.defaultLocale),
    },
  };
}
