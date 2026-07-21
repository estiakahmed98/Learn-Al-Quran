import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/site-config";

/**
 * Cache tags used with revalidateTag() after admin writes. Keep these in
 * sync with the admin API routes that mutate the underlying tables.
 * Site settings caching itself lives in lib/site-config.ts to avoid a
 * circular import (this file would otherwise need fallbackSettings from
 * site-config.ts, which needs nothing from here).
 */
export const CACHE_TAGS = {
  siteSettings: SITE_SETTINGS_CACHE_TAG,
  courses: "courses",
  course: (slug: string) => `course:${slug}`,
  blogs: "blogs",
  blog: (slug: string) => `blog:${slug}`,
  teachers: "teachers",
  content: (type: string) => `content:${type}`
} as const;

export const getCachedActiveCourses = unstable_cache(
  async () => {
    return prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });
  },
  ["active-courses"],
  { revalidate: 3600, tags: [CACHE_TAGS.courses] }
);

export const getCachedCourseBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.course.findFirst({
      where: { isActive: true, OR: [{ id: slug }, { slug }] }
    });
  },
  ["course-by-slug"],
  { revalidate: 3600 }
);

export const getCachedPublishedBlogs = unstable_cache(
  async (page: number, limit: number, search: string) => {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { author: { contains: search, mode: "insensitive" as const } },
            { summary: { contains: search, mode: "insensitive" as const } }
          ]
        }
      : {};

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.blog.count({ where })
    ]);

    return { blogs, total };
  },
  ["published-blogs"],
  { revalidate: 900, tags: [CACHE_TAGS.blogs] }
);

export const getCachedBlogBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.blog.findUnique({ where: { slug } });
  },
  ["blog-by-slug"],
  { revalidate: 3600 }
);

export const getCachedTeachers = unstable_cache(
  async () => {
    return prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: { id: true, name: true, designation: true, description: true, imageURL: true },
      orderBy: { name: "asc" }
    });
  },
  ["teachers"],
  { revalidate: 3600, tags: [CACHE_TAGS.teachers] }
);
