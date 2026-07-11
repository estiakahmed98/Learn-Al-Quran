import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles and guides on Quran learning, Tajweed rules, Hifz tips, and Islamic education from Learn Al Quran Online BD.",
  alternates: { canonical: "/blog" }
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await prisma.content
    .findMany({ where: { type: "BLOG", isPublished: true }, orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-semibold uppercase tracking-wide text-gold">Blog</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">
          Quran Learning Tips &amp; Islamic Articles
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">
          We're preparing helpful articles for you. Please check back soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition hover:shadow-lg"
            >
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt={post.title} className="aspect-video w-full object-cover" />
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                <h2 className="mt-2 font-heading text-lg font-bold text-primary-dark">
                  {post.title}
                </h2>
                {post.subtitle && <p className="mt-2 text-sm text-gray-600">{post.subtitle}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
