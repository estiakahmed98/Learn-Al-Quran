import { unstable_cache, revalidateTag } from "next/cache";
import { api } from "@/lib/api-client";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/site-config";

/** Next.js 16's revalidateTag requires a cache-life profile; "max" matches our tag-based (not time-based) invalidation strategy. */
export function invalidateTag(tag: string) {
  revalidateTag(tag, "max");
}

/**
 * Cache tags used with revalidateTag() after admin writes. Keep these in
 * sync with the Server Actions that mutate the underlying tables.
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
    const { data } = await api.courses.list({ perPage: 100 });
    return data;
  },
  ["active-courses"],
  { revalidate: 3600, tags: [CACHE_TAGS.courses] }
);

export const getCachedCourseBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await api.courses.getBySlug(slug);
    } catch {
      return null;
    }
  },
  ["course-by-slug"],
  { revalidate: 3600, tags: [CACHE_TAGS.courses] }
);

export const getCachedPublishedBlogs = unstable_cache(
  async (page: number, limit: number, search: string) => {
    const { data, total } = await api.blogs.list({ page, perPage: limit });
    // The Laravel endpoint doesn't support server-side search yet; filter
    // client-side over the current page as a stopgap.
    const blogs = search
      ? data.filter((blog: any) =>
          [blog.title, blog.author, blog.summary].some((field) =>
            String(field ?? "").toLowerCase().includes(search.toLowerCase())
          )
        )
      : data;
    return { blogs, total };
  },
  ["published-blogs"],
  { revalidate: 900, tags: [CACHE_TAGS.blogs] }
);

export const getCachedBlogBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await api.blogs.getBySlug(slug);
    } catch {
      return null;
    }
  },
  ["blog-by-slug"],
  { revalidate: 3600, tags: [CACHE_TAGS.blogs] }
);

export const getCachedTeachers = unstable_cache(
  async () => {
    return api.teachers.list();
  },
  ["teachers"],
  { revalidate: 3600, tags: [CACHE_TAGS.teachers] }
);
