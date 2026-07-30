"use client";

import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

export default function TopBar({ phone }: { phone: string }) {
  const t = useTranslations("hero");

  if (!phone) return null;

  return (
    <div className="hidden items-center justify-end gap-4 border-b border-white/10 bg-primary-dark px-4 py-1.5 text-right xl:flex xl:px-8">
      <a
        href={`tel:${phone}`}
        onClick={() => trackEvent("call_click", { location: "topbar" })}
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition hover:text-gold"
      >
        📞 {t("callUs")}: <span dir="ltr">{phone}</span>
      </a>

      <span className="h-4 w-px bg-white/15" />

      <div className="inline-flex items-center gap-2">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-white">5.0</p>
          <p className="text-[10px] tracking-wider text-gold" aria-label="5 out of 5 stars">
            ★★★★★
          </p>
        </div>
        <p className="max-w-[10rem] text-[10px] leading-snug text-white/70">{t("trustedBy")}</p>
      </div>
    </div>
  );
}
