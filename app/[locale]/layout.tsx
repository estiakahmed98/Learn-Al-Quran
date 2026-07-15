import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import AuthProvider from "@/components/admin/AuthProvider";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import AnalyticsTracker from "@/components/admin/AnalyticsTracker";
import JsonLd from "@/components/shared/JsonLd";
import { getSiteSettings, siteUrl } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = hasLocale(routing.locales, params.locale) ? params.locale : routing.defaultLocale;
  const ogLocale = locale === "bn" ? "bn_BD" : "en_US";
  const ogAlternateLocale = locale === "bn" ? "en_US" : "bn_BD";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Learn Al Quran Online BD | Online Quran, Tajweed & Hifz Classes",
      template: "%s | Learn Al Quran Online BD"
    },
    description:
      "Learn the Holy Quran online with certified Huffaz and Qaris. One-to-one Nazera, Tajweed, Hifz, Maktab and Adult Quran learning classes for students worldwide. Book a free trial class today.",
    keywords: [
      "Learn Quran Online",
      "Online Quran Classes Bangladesh",
      "Tajweed Course",
      "Hifzul Quran Online",
      "Nazera Quran",
      "Online Madrasa BD",
      "Quran teacher online",
      "Adult Quran Learning",
      "কুরআন শরীফ",
      "অনলাইন কুরআন শিক্ষা",
      "কুরআন তেলাওয়াত",
      "তাজবীদ শিক্ষা",
      "আল কুরআন",
      "কুরআন শিক্ষা কোর্স",
      "হিফজুল কুরআন",
      "অনলাইন মাদ্রাসা"
    ],
    authors: [{ name: "Learn Al Quran Online BD" }],
    creator: "Learn Al Quran Online BD",
    alternates: {
      canonical: "/"
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ogAlternateLocale,
      url: siteUrl,
      siteName: "Learn Al Quran Online BD",
      title: "Learn Al Quran Online BD | Online Quran, Tajweed & Hifz Classes",
      description:
        "Personalized live online Quran, Tajweed & Hifz classes for kids and adults, with certified Huffaz and Qaris. Book your free trial class today.",
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Learn Al Quran Online BD" }]
    },
    twitter: {
      card: "summary_large_image",
      title: "Learn Al Quran Online BD",
      description:
        "Learn the Holy Quran online with certified Huffaz and Qaris. Book a free trial class today.",
      images: ["/images/og-image.jpg"]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
}

export const viewport: Viewport = {
  themeColor: "#28504F",
  width: "device-width",
  initialScale: 1
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }

  const settings = await getSiteSettings();
  const locale = await getLocale();
  const messages = await getMessages();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Learn Al Quran Online BD",
    url: siteUrl,
    logo: `${siteUrl}/Learn_Al_Quran_Logo.png`,
    description:
      "Online Madrasa offering Quran, Tajweed, Hifz and Islamic education courses for students worldwide.",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD"
    },
    sameAs: [settings.facebookUrl, settings.youtubeUrl, settings.instagramUrl].filter(Boolean)
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Learn Al Quran Online BD",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col font-body">
        <GoogleAnalytics gaId={settings.ga4Id || ""} />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
