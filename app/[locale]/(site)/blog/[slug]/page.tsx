import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogDetails from "@/components/admin/blog/BlogDetails";
import { prisma } from "@/lib/prisma";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [blog, t] = await Promise.all([
    prisma.blog.findUnique({ where: { slug: params.slug } }).catch(() => null),
    getTranslations("sitePages.blog")
  ]);

  if (!blog) {
    return {
      title: t("notFound"),
      description: t("heroSubtitle"),
      alternates: buildAlternates(`/blog/${params.slug}`)
    };
  }

  return {
    title: blog.title,
    description: blog.summary,
    alternates: buildAlternates(`/blog/${params.slug}`),
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.summary,
      images: blog.image ? [{ url: blog.image }] : undefined,
      publishedTime: blog.date.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      authors: [blog.author]
    }
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const [blog, t] = await Promise.all([
    prisma.blog.findUnique({ where: { slug: params.slug } }).catch(() => null),
    getTranslations("sitePages.blog")
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: t("eyebrow"), url: `${siteUrl}/blog` },
    { name: blog?.title || params.slug, url: `${siteUrl}/blog/${params.slug}` }
  ]);

  const articleJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.summary,
        image: blog.image ? [blog.image] : undefined,
        datePublished: blog.date.toISOString(),
        dateModified: blog.updatedAt.toISOString(),
        author: {
          "@type": "Person",
          name: blog.author
        }
      }
    : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <BlogDetails />
    </>
  );
}
