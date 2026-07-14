import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/books`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about-us`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/free-trial-class`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/enroll`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 }
  ];

  try {
    const [courses, blogs] = await Promise.all([
      prisma.course.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.content.findMany({
        where: { type: "BLOG", isPublished: true },
        select: { slug: true, updatedAt: true }
      })
    ]);

    const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
      url: `${siteUrl}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${siteUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6
    }));

    return [...staticRoutes, ...courseRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
