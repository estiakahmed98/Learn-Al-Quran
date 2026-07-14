import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for Learn Al Quran Online BD courses.",
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: false }
};

export const revalidate = 3600;

export default async function TermsPage() {
  const [settings, t, locale] = await Promise.all([
    getSiteSettings(),
    getTranslations("sitePages.terms"),
    getLocale()
  ]);
  const date = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB").format(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary-dark">{t("title")}</h1>
      <p className="mt-2 text-sm text-gray-400">{t("updated", { date })}</p>

      {settings.terms ? (
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-gray-700">
          {settings.terms}
        </div>
      ) : (
        <div className="prose prose-lg mt-8 max-w-none text-gray-700">
          <h2>{t("enrollmentTitle")}</h2>
          <p>{t("enrollmentBody")}</p>
          <h2>{t("refundTitle")}</h2>
          <p>{t("refundBody")}</p>
          <h2>{t("scheduleTitle")}</h2>
          <p>{t("scheduleBody")}</p>
          <h2>{t("conductTitle")}</h2>
          <p>{t("conductBody")}</p>
          <h2>{t("contactTitle")}</h2>
          <p>{t("contactBody", { email: settings.email })}</p>
        </div>
      )}
    </div>
  );
}
