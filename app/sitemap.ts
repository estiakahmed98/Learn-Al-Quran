import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

function localePrefix(locale: string) {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

function buildEntry(
  path: string,
  options: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified?: Date }
): MetadataRoute.Sitemap {
  const clean = path === "/" ? "" : path;

  return routing.locales.map((locale) => ({
    url: `${siteUrl}${localePrefix(locale)}${clean || "/"}`,
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}${localePrefix(l)}${clean || "/"}`])
      )
    }
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    ...buildEntry("/", { changeFrequency: "weekly", priority: 1 }),
    ...buildEntry("/courses", { changeFrequency: "weekly", priority: 0.9 }),
    ...buildEntry("/books", { changeFrequency: "monthly", priority: 0.6 }),
    ...buildEntry("/about-us", { changeFrequency: "monthly", priority: 0.6 }),
    ...buildEntry("/blog", { changeFrequency: "weekly", priority: 0.7 }),
    ...buildEntry("/contact-us", { changeFrequency: "monthly", priority: 0.5 }),
    ...buildEntry("/free-trial-class", { changeFrequency: "monthly", priority: 0.9 }),
    ...buildEntry("/enroll", { changeFrequency: "monthly", priority: 0.8 }),
    ...buildEntry("/privacy-policy", { changeFrequency: "yearly", priority: 0.2 }),
    ...buildEntry("/terms-and-conditions", { changeFrequency: "yearly", priority: 0.2 })
  ];

  try {
    const [courses, blogs] = await Promise.all([
      prisma.course.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.content.findMany({
        where: { type: "BLOG", isPublished: true },
        select: { slug: true, updatedAt: true }
      })
    ]);

    const courseRoutes: MetadataRoute.Sitemap = courses.flatMap((c) =>
      buildEntry(`/courses/${c.slug}`, {
        changeFrequency: "monthly",
        priority: 0.8,
        lastModified: c.updatedAt
      })
    );

    const blogRoutes: MetadataRoute.Sitemap = blogs.flatMap((b) =>
      buildEntry(`/blog/${b.slug}`, {
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: b.updatedAt
      })
    );

    return [...staticRoutes, ...courseRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
