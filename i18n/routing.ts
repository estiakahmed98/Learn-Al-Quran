import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bn"] as const,
  defaultLocale: "bn",
  localePrefix: "as-needed"
});

export type Locale = (typeof routing.locales)[number];
