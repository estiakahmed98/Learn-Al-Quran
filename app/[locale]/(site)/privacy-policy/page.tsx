import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy of Learn Al Quran Online BD.",
  alternates: buildAlternates("/privacy-policy"),
  robots: { index: false }
};

export const revalidate = 3600;

export default async function PrivacyPolicyPage() {
  const [settings, t, locale] = await Promise.all([
    getSiteSettings(),
    getTranslations("sitePages.privacy"),
    getLocale()
  ]);
  const date = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB").format(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary-dark">{t("title")}</h1>
      <p className="mt-2 text-sm text-gray-400">{t("updated", { date })}</p>

      {settings.privacyPolicy ? (
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-gray-700">
          {settings.privacyPolicy}
        </div>
      ) : (
        <div className="prose prose-lg mt-8 max-w-none text-gray-700">
          <p>{t("intro")}</p>
          <h2>{t("collectTitle")}</h2>
          <p>{t("collectBody")}</p>
          <h2>{t("useTitle")}</h2>
          <p>{t("useBody")}</p>
          <h2>{t("contactTitle")}</h2>
          <p>{t("contactBody", { email: settings.email })}</p>
        </div>
      )}
    </div>
  );
}
