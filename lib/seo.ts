import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

/**
 * Builds canonical + hreflang alternate URLs for a given locale-neutral pathname.
 * `pathname` should be the path WITHOUT a locale prefix, e.g. "/courses" or "/".
 */
export function buildAlternates(pathname: string): Metadata["alternates"] {
  const clean = pathname === "/" ? "" : pathname;

  return {
    canonical: `${siteUrl}${clean || "/"}`,
    languages: {
      en: `${siteUrl}${clean || "/"}`,
      bn: `${siteUrl}/bn${clean}`,
      "x-default": `${siteUrl}${clean || "/"}`
    }
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
