"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const targetLabel: Record<string, string> = {
  en: "বাংলা",
  bn: "EN"
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "bn" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
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
