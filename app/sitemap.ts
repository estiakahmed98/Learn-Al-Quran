import type { MetadataRoute } from "next";
import { api } from "@/lib/api-client";
import { siteUrl } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

// Read current API data on every sitemap request, including changes made directly in Laravel.
export const dynamic = "force-dynamic";

type SitemapRecord = { slug: string; updatedAt?: string };

async function allPages(
  load: (page: number) => Promise<{ data: SitemapRecord[]; lastPage: number }>
): Promise<SitemapRecord[]> {
  const records: SitemapRecord[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const result = await load(page);
    records.push(...result.data);
    lastPage = result.lastPage;
    page += 1;
  } while (page <= lastPage);
  return records;
}

function localePrefix(locale: string) {
  return `/${locale}`;
}

function absoluteUrl(path: string) {
  return new URL(path.replace(/^\/+/, ""), `${siteUrl}/`).toString();
}

function buildEntry(
  path: string,
  options: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified?: string | Date }
): MetadataRoute.Sitemap {
  const clean = path === "/" ? "" : path;

  return routing.locales.map((locale) => {
    const localizedPath = `${localePrefix(locale)}${clean || "/"}`;

    return {
      url: absoluteUrl(localizedPath),
      lastModified: options.lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [
            l,
            absoluteUrl(`${localePrefix(l)}${clean || "/"}`)
          ]),
          [
            "x-default",
            absoluteUrl(`${localePrefix(routing.defaultLocale)}${clean || "/"}`)
          ]
        ])
      }
    };
  });
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
    ...buildEntry("/terms-and-conditions", { changeFrequency: "yearly", priority: 0.2 }),
    ...buildEntry("/return-policy", { changeFrequency: "yearly", priority: 0.2 })
  ];

  const [courses, blogs] = await Promise.all([
    allPages((page) => api.courses.list({ page, perPage: 100 }, undefined, { cache: "no-store", next: undefined })),
    allPages((page) => api.blogs.list({ page, perPage: 100 }, { cache: "no-store", next: undefined }))
  ]);

  const courseRoutes = courses.flatMap((course) =>
    buildEntry(`/courses/${course.slug}`, {
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: course.updatedAt
    })
  );
  const blogRoutes = blogs.flatMap((blog) =>
    buildEntry(`/blog/${blog.slug}`, {
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: blog.updatedAt
    })
  );

  // Let API failures return an error rather than a misleading, incomplete sitemap.
  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
