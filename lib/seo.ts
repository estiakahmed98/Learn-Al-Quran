import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";
import { routing, type Locale } from "@/i18n/routing";

export function localizedPath(locale: Locale, pathname: string) {
  const clean = pathname === "/" ? "" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  const prefix = `/${locale}`;
  return `${prefix}${clean}` || "/";
}

export function buildCanonicalUrl(locale: Locale, pathname: string) {
  return new URL(localizedPath(locale, pathname), `${siteUrl}/`).toString();
}

/**
 * Builds canonical + hreflang alternate URLs for a given locale-neutral pathname.
 * `pathname` should be the path WITHOUT a locale prefix, e.g. "/courses" or "/".
 */
export function buildAlternates(
  locale: Locale,
  pathname: string
): Metadata["alternates"] {
  return {
    canonical: buildCanonicalUrl(locale, pathname),
    languages: Object.fromEntries([
      ...routing.locales.map((language) => [
        language,
        buildCanonicalUrl(language, pathname)
      ]),
      ["x-default", buildCanonicalUrl(routing.defaultLocale, pathname)]
    ])
  };
}

export function publicPageMetadata(
  locale: Locale,
  pathname: string,
  metadata: Omit<Metadata, "alternates" | "robots">
): Metadata {
  return {
    ...metadata,
    alternates: buildAlternates(locale, pathname),
    robots: { index: true, follow: true }
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object from an ordered list of items.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
