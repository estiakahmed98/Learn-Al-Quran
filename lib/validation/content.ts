import { z } from "zod";

const contentTypeSchema = z.enum(["PAGE", "HOME_SECTION", "TEACHER", "REVIEW", "FAQ", "BLOG", "BOOK"]);
const jsonValueSchema: z.ZodType<unknown> = z.any();

// Explicit allowlist of writable Content fields — excludes id, createdAt, updatedAt.
export const contentCreateSchema = z.object({
  type: contentTypeSchema,
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  subtitle: z.string().trim().max(500).nullable().optional(),
  description: z.string().trim().nullable().optional(),
  image: z.string().trim().max(2048).nullable().optional(),
  data: jsonValueSchema.optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const contentUpdateSchema = contentCreateSchema.partial();
