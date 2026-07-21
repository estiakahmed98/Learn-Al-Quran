import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bn"] as const,
  defaultLocale: "bn",
  localePrefix: "as-needed",
  // Keep unprefixed URLs deterministically Bangla. English remains available
  // through the explicit /en prefix selected by the locale switcher.
  localeDetection: false
});

export type Locale = (typeof routing.locales)[number];
