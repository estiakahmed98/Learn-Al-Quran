import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import JsonLd from "@/components/shared/JsonLd";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  return prisma.content
    .findUnique({ where: { slug, type: "BLOG", isPublished: true } })
    .catch(() => null);
}

export async function generateStaticParams() {
  const posts = await prisma.content
    .findMany({ where: { type: "BLOG" }, select: { slug: true } })
    .catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.subtitle || post.description?.slice(0, 160),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.subtitle || undefined,
      images: post.image ? [{ url: post.image }] : undefined
    }
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.subtitle || undefined,
    image: post.image ? [post.image] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "Learn Al Quran Online BD" },
    publisher: {
      "@type": "Organization",
      name: "Learn Al Quran Online BD",
      logo: { "@type": "ImageObject", url: `${siteUrl}/Learn_Al_Quran_Logo.png` }
    }
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <JsonLd data={articleJsonLd} />

      <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">{post.title}</h1>
      {post.subtitle && <p className="mt-3 text-lg text-gray-600">{post.subtitle}</p>}

      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title}
          className="mt-6 aspect-video w-full rounded-2xl object-cover"
        />
      )}

      <div className="prose prose-lg mt-8 max-w-none text-gray-700 whitespace-pre-line">
        {post.description}
      </div>
    </article>
  );
}
