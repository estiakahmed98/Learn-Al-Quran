// components/blog/BlogList.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

interface Blog {
  id: number;
  slug?: string;
  title: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const formatFacebookTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);

  const diffMs = now.getTime() - past.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;

  if (days === 1) {
    return `Yesterday at ${past.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (past.getFullYear() === now.getFullYear()) {
    return (
      past.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }) +
      " at " +
      past.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }

  return (
    past.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    past.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
};

export default function AllBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cache] = useState<Map<number, { blogs: Blog[]; totalPages: number }>>(
    new Map()
  );

  const fetchBlogs = useCallback(async (pageNum: number) => {
    if (cache.has(pageNum)) {
      const cached = cache.get(pageNum)!;
      setBlogs(cached.blogs);
      setTotalPages(cached.totalPages);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (res.ok && data?.blogs) {
        cache.set(pageNum, {
          blogs: data.blogs,
          totalPages: data.pagination?.pages || 1,
        });

        setBlogs(data.blogs);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (e) {
      console.error("Failed to fetch blogs", e);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  const blogItems = useMemo(
    () =>
      blogs.map((blog) => ({
        ...blog,
        href: `blog/${blog.slug || generateSlug(blog.title)}`,
        formattedDate: formatFacebookTime(blog.createdAt),
      })),
    [blogs]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 py-12" />
    );
  }

  if (!blogs.length) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20">
        <div className="text-center p-10 bg-white/80 rounded-3xl shadow-xl border border-emerald-200">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-emerald-600 mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-600">
            Please check back later for new content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <section aria-label="Blog posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogItems.map((blog) => (
              <article key={blog.id} className="group">
                <Link href={blog.href} aria-label={`Read: ${blog.title}`}>
                  <div className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-emerald-200/30 hover:scale-105">
                    <div className="relative h-48 overflow-hidden">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-emerald-100">
                          📝
                        </div>
                      )}
                      <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                        Blog
                      </span>
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.summary}
                      </p>
                      <div className="flex items-center justify-between border-t pt-4 text-sm text-emerald-600">
                        <time>{blog.formattedDate}</time>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="flex justify-center gap-4 mt-16"
          >
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
