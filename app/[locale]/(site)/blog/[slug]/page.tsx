import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BlogDetails from "@/components/admin/blog/BlogDetails";
import { prisma } from "@/lib/prisma";
import { getCachedBlogBySlug } from "@/lib/cached-data";
import { sanitizeRichHtml } from "@/lib/sanitize-html";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

interface Props {
  params: { slug: string };
}

// Next.js should hand `params.slug` to us already decoded, but on some
// versions/route configurations non-ASCII segments (e.g. Bangla slugs)
// arrive still percent-encoded after the next-intl locale redirect. Decode
// defensively — decoding an already-decoded string is a safe no-op.
function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// `unstable_cache` persists values as JSON, so Prisma Date instances can
// return as ISO strings on cache hits. Normalize both shapes before using
// them in metadata or passing them across the Server/Client boundary.
function serializeDate(value: Date | string | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeSlug(params.slug);
  const [blog, t] = await Promise.all([
    getCachedBlogBySlug(slug).catch(() => null),
    getTranslations("sitePages.blog")
  ]);

  if (!blog) {
    return {
      title: t("notFound"),
      description: t("heroSubtitle"),
      alternates: buildAlternates(`/blog/${slug}`)
    };
  }

  const publishedTime = serializeDate(blog.date);
  const modifiedTime = serializeDate(blog.updatedAt);

  return {
    title: blog.title,
    description: blog.summary,
    alternates: buildAlternates(`/blog/${blog.slug}`),
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.summary,
      images: blog.image ? [{ url: blog.image }] : undefined,
      publishedTime: publishedTime || undefined,
      modifiedTime: modifiedTime || undefined,
      authors: [blog.author]
    }
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const slug = decodeSlug(params.slug);
  const [blog, t] = await Promise.all([
    getCachedBlogBySlug(slug).catch(() => null),
    getTranslations("sitePages.blog")
  ]);

  if (!blog) {
    notFound();
  }

  const publishedAt =
    serializeDate(blog.date) ||
    serializeDate(blog.createdAt) ||
    new Date(0).toISOString();
  const createdAt = serializeDate(blog.createdAt) || publishedAt;
  const updatedAt = serializeDate(blog.updatedAt) || createdAt;

  const recentBlogs = await prisma.blog
    .findMany({
      where: { slug: { not: blog.slug } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        date: true,
        image: true,
        createdAt: true
      }
    })
    .catch(() => []);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: t("eyebrow"), url: `${siteUrl}/blog` },
    { name: blog.title, url: `${siteUrl}/blog/${blog.slug}` }
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.summary,
    image: blog.image ? [blog.image] : undefined,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: blog.author
    }
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="container max-w-none">
        <BlogDetails
          blog={{
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            // Defense-in-depth: re-sanitize at render time even though
            // content is sanitized on save, in case older rows predate
            // that change.
            content: sanitizeRichHtml(blog.content),
            summary: blog.summary,
            author: blog.author,
            date: publishedAt,
            image: blog.image || undefined,
            ads: blog.ads,
            createdAt,
            updatedAt
          }}
          recentBlogs={recentBlogs.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            date:
              serializeDate(item.date) ||
              serializeDate(item.createdAt) ||
              publishedAt,
            image: item.image || undefined
          }))}
        />
      </div>
    </>
  );
}
