"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const targetLabel: Record<string, string> = {
  en: "বাংলা",
  bn: "EN"
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "bn" : "en";

    // Strip an existing locale prefix (e.g. "/bn/courses" -> "/courses").
    const withoutLocale = pathname.replace(/^\/(en|bn)(?=\/|$)/, "") || "/";
    const nextPath = next === "en" ? withoutLocale : `/bn${withoutLocale === "/" ? "" : withoutLocale}`;
    const query = searchParams.toString();
    const destination = query ? `${nextPath}?${query}` : nextPath;

    startTransition(() => router.push(destination || "/"));
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={`Switch to ${targetLabel[locale] === "EN" ? "English" : "Bangla"}`}
      className="rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-cream disabled:opacity-60"
    >
      {targetLabel[locale] ?? "EN"}
    </button>
  );
}
