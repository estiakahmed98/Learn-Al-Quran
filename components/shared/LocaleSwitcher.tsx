"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", label: "EN" },
  { code: "bn", label: "বাং" }
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(code: string) {
    if (code === locale) return;
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex overflow-hidden rounded-full border border-gold/40 text-xs font-semibold">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchTo(l.code)}
          disabled={isPending}
          aria-pressed={locale === l.code}
          className={`px-2.5 py-1.5 transition ${
            locale === l.code
              ? "bg-primary text-white"
              : "bg-white text-gray-600 hover:bg-cream hover:text-primary"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
