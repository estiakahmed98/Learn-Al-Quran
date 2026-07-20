"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ConsentCheckbox({
  checked,
  onChange,
  dark = false
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  dark?: boolean;
}) {
  const t = useTranslations("consent");
  const textClass = dark ? "text-white/70" : "text-gray-600";
  const linkClass = dark
    ? "font-semibold text-secondary underline hover:text-white"
    : "font-semibold text-primary underline hover:text-primary-dark";

  return (
    <label className={`flex items-start gap-2.5 text-sm leading-6 ${textClass}`}>
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/40"
      />
      <span className="break-words">
        {t.rich("label", {
          terms: (chunks) => (
            <Link key="terms" href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className={linkClass}>
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link key="privacy" href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
              {chunks}
            </Link>
          )
        })}
      </span>
    </label>
  );
}
