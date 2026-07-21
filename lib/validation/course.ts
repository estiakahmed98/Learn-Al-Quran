import { z } from "zod";
import type { Prisma } from "@prisma/client";

const jsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.any();

// Explicit allowlist of writable Course fields. Deliberately excludes id,
// createdAt, updatedAt and relation fields so a client can never smuggle in
// values for those via mass assignment.
export const courseCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  description: z.string().trim().min(1),
  thumbnail: z.string().trim().max(2048).nullable().optional(),
  bannerImage: z.string().trim().max(2048).nullable().optional(),

  titleBn: z.string().trim().max(200).nullable().optional(),
  descriptionBn: z.string().trim().nullable().optional(),

  category: z.string().trim().max(120).nullable().optional(),
  categoryBn: z.string().trim().max(120).nullable().optional(),
  courseType: z.string().trim().max(120).nullable().optional(),
  courseTypeBn: z.string().trim().max(120).nullable().optional(),
  classType: z.string().trim().max(120).nullable().optional(),
  classTypeBn: z.string().trim().max(120).nullable().optional(),
  level: z.string().trim().max(120).nullable().optional(),
  levelBn: z.string().trim().max(120).nullable().optional(),

  instructorName: z.string().trim().max(200).nullable().optional(),
  instructorId: z.string().trim().max(64).nullable().optional(),

  totalLessons: z.number().int().min(0).nullable().optional(),
  totalHours: z.number().int().min(0).nullable().optional(),

  startDate: z.coerce.date().nullable().optional(),
  enrollDeadline: z.coerce.date().nullable().optional(),

  fee: z.number().int().min(0).max(10_000_000),
  originalFee: z.number().int().min(0).max(10_000_000).nullable().optional(),
  couponCode: z.string().trim().max(64).nullable().optional(),
  couponPercent: z.number().int().min(0).max(100).nullable().optional(),
  certificate: z.boolean().optional(),

  duration: z.string().trim().max(120).nullable().optional(),
  curriculum: jsonValueSchema.optional(),
  learnPoints: jsonValueSchema.optional(),
  features: jsonValueSchema.optional(),
  whyCards: jsonValueSchema.optional(),
  faqs: jsonValueSchema.optional(),

  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),

  metaTitle: z.string().trim().max(200).nullable().optional(),
  metaDescription: z.string().trim().max(500).nullable().optional()
});

// Same shape but every field optional, for PATCH.
export const courseUpdateSchema = courseCreateSchema.partial();
