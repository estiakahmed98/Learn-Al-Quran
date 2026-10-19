import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bn"] as const,
  defaultLocale: "en",
  // Every translated page has one unambiguous, self-referencing URL.
  // Unprefixed aliases are permanently redirected to the English equivalent.
  localePrefix: "always",
  localeDetection: false
});

export type Locale = (typeof routing.locales)[number];
