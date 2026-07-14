import { prisma } from "@/lib/prisma";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://learnalquranonlinebd.com";
export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Learn Al Quran Online BD";
export const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || "";

export const fallbackSettings = {
  siteName,
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+8801234567890",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801234567890",
  email: "info@learnalquranonlinebd.com",
  address: "Dhaka, Bangladesh",
  bkashNumber: "0123456789",
  nagadNumber: "0123456789",
  rocketNumber: "0123456789",
  bankAccount: "Contact us for bank details",
  westernUnionInfo: "Contact us for Western Union details",
  facebookUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  googleMapUrl:
    "https://www.google.com/maps?q=Dhaka%2C%20Bangladesh&z=12&output=embed",
  ga4Id,
  privacyPolicy: "",
  terms: "",
  copyrightText: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`
};

// Cached fetch of site settings from the DB, gracefully falling back
// so the site still renders even before a database is connected.
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findFirst();
    if (!settings) return fallbackSettings;

    // Only override fallback values with DB values that are actually set (not null/empty).
    const merged: Record<string, unknown> = { ...fallbackSettings };
    for (const [key, value] of Object.entries(settings)) {
      if (value !== null && value !== undefined && value !== "") {
        merged[key] = value;
      }
    }
    return merged as typeof fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}
