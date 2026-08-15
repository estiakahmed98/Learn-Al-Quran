import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
// Poppins is only used via font-heading, and in this codebase that's always
// paired with font-bold (700) or, rarely, font-semibold (600) — 500 isn't
// used and was dead weight.
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import AuthProvider from "@/components/admin/AuthProvider";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "@/components/shared/GoogleTagManager";
import AnalyticsTracker from "@/components/admin/AnalyticsTracker";
import JsonLd from "@/components/shared/JsonLd";
import { getSiteSettings, siteUrl } from "@/lib/site-config";
import { parseSocialLinks } from "@/lib/social-platforms";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = hasLocale(routing.locales, params.locale)
    ? params.locale
    : routing.defaultLocale;
  const ogLocale = locale === "bn" ? "bn_BD" : "en_US";
  const ogAlternateLocale = locale === "bn" ? "en_US" : "bn_BD";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default:
        "Bangla Quran Shikkha | Learn Al Quran Online BD | Learn Quran Online ",
      template: "%s | Learn Al Quran Online BD",
    },
    description:
      "Learn Quran Online with expert tutors in Bangladesh. Bangla Quran Shikkha for kids & adults — Tajweed, Hifz & Nazera classes. Join Learn Al Quran Online BD today!",
    keywords: [
      "Learn Quran Online",
      "Bangla Quran Shikkha",
      "Bangla Quran",
      "Online Quran Classes Bangladesh",
      "spoken english course",
      "spoken english bangla",
      "learn english speaking",
      "english speaking course",
      "spoken english spoken english",
      "spoken english for kids",
      "Tajweed Course",
      "Hifzul Quran Online",
      "Nazera Quran",
      "Online Madrasa BD",
      "Quran teacher online",
      "Adult Quran Learning",
      "কুরআন শরীফ",
      "অনলাইন কুরআন শিক্ষা",
      "কুরআন তেলাওয়াত বাংলা অর্থসহ",
      "কুরআন তেলাওয়াত",
      "তাজবীদ শিক্ষা",
      "আল কুরআন",
      "কুরআন শিক্ষা কোর্স",
      "হিফজুল কুরআন",
      "স্পোকেন ইংলিশ কোর্স",
      "অনলাইন মাদ্রাসা",
    ],
    authors: [{ name: "Learn Al Quran Online BD" }],
    creator: "Learn Al Quran Online BD",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ogAlternateLocale,
      url: siteUrl,
      siteName: "Learn Al Quran Online BD",
      title:
        "Bangla Quran Shikkha | Learn Al Quran Online BD | Learn Quran Online ",
      description:
        "Learn Quran Online with expert tutors in Bangladesh. Bangla Quran Shikkha for kids & adults — Tajweed, Hifz & Nazera classes. Join Learn Al Quran Online BD today!",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Learn Al Quran Online BD",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Learn Al Quran Online BD",
      description:
        "Learn Quran Online with expert tutors in Bangladesh. Bangla Quran Shikkha for kids & adults — Tajweed, Hifz & Nazera classes. Join Learn Al Quran Online BD today!",
      images: ["/images/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#28504F",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { children } = props;

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
      addressCountry: "BD",
    },
    sameAs: parseSocialLinks(settings.socialLinks)
      .map((link) => link.url)
      .filter(Boolean),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Learn Al Quran Online BD",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-body">
        <GoogleTagManager gtmId={gtmId} />
        <GoogleTagManagerNoScript gtmId={gtmId} />
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
