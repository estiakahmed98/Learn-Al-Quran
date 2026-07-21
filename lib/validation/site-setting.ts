import { z } from "zod";

const socialLinkSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  url: z.string().trim().max(2048)
});

// Explicit allowlist of writable SiteSetting fields — excludes id, createdAt,
// updatedAt. All fields optional since the admin form saves the full form
// state as one PUT, but individual fields may be blank.
export const siteSettingSchema = z.object({
  siteName: z.string().trim().min(1).max(200).optional(),
  logo: z.string().trim().max(2048).nullable().optional(),
  favicon: z.string().trim().max(2048).nullable().optional(),

  phone: z.string().trim().max(50).nullable().optional(),
  whatsapp: z.string().trim().max(50).nullable().optional(),
  email: z.string().trim().max(200).nullable().optional(),
  address: z.string().trim().nullable().optional(),

  bkashNumber: z.string().trim().max(50).nullable().optional(),
  nagadNumber: z.string().trim().max(50).nullable().optional(),
  rocketNumber: z.string().trim().max(50).nullable().optional(),
  bankAccount: z.string().trim().nullable().optional(),
  westernUnionInfo: z.string().trim().nullable().optional(),

  socialLinks: z.array(socialLinkSchema).max(20).optional(),

  googleMapUrl: z.string().trim().nullable().optional(),

  ga4Id: z.string().trim().max(50).nullable().optional(),

  copyrightText: z.string().trim().max(500).nullable().optional(),
  privacyPolicy: z.string().trim().nullable().optional(),
  terms: z.string().trim().nullable().optional(),
  returnPolicy: z.string().trim().nullable().optional(),

  heroBadgeEn: z.string().trim().max(200).nullable().optional(),
  heroBadgeBn: z.string().trim().max(200).nullable().optional(),
  heroTitleEn: z.string().trim().nullable().optional(),
  heroTitleBn: z.string().trim().nullable().optional(),
  heroSubtitleEn: z.string().trim().nullable().optional(),
  heroSubtitleBn: z.string().trim().nullable().optional(),
  heroImage: z.string().trim().max(2048).nullable().optional(),

  aboutTitleEn: z.string().trim().max(200).nullable().optional(),
  aboutTitleBn: z.string().trim().max(200).nullable().optional(),
  aboutDescriptionEn: z.string().trim().nullable().optional(),
  aboutDescriptionBn: z.string().trim().nullable().optional(),
  aboutImage: z.string().trim().max(2048).nullable().optional()
});
