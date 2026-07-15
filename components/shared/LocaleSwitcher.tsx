"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

const targetLabel: Record<string, string> = {
  en: "বাংলা",
  bn: "EN"
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "bn" : "en";
    const query = searchParams.toString();
    const hash = window.location.hash;
    const href = `${pathname}${query ? `?${query}` : ""}${hash}`;

    startTransition(() => {
      router.replace(href, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={`Switch to ${targetLabel[locale] === "EN" ? "English" : "Bangla"}`}
      className="rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-cream disabled:opacity-60"
    >
      {targetLabel[locale] ?? "EN"}
    </button>
  );
}
