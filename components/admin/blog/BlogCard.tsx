"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { processBlogSummary } from "./summaryUtils";
import { listBlogsForAdmin, deleteBlog } from "@/app/admin/blog/actions";

const BlogForm = dynamic(() => import("./BlogForm"), { ssr: false });

interface Blog {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function BlogCard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      // The Laravel blogs endpoint doesn't support server-side search yet;
      // filter client-side over the current page as a stopgap (matches the
      // approach used in lib/cached-data.ts for the public blog listing).
      const { data, total, lastPage } = await listBlogsForAdmin({ page, perPage: 12 });
      const filtered = debouncedSearchTerm
        ? data.filter((blog: any) =>
            [blog.title, blog.author, blog.summary].some((field) =>
              String(field ?? "").toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
          )
        : data;

      setBlogs(filtered);
      setTotalPages(lastPage || 1);
      setTotalCount(total || 0);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Keep existing blogs on error to avoid empty state
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, page]);

  // Optimized useEffect with proper dependencies
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(error instanceof Error ? error.message : "Error deleting blog");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex justify-between">
          <div>
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-9 w-36 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-gray-600">
              <tr>
                <th className="px-4 py-3">Blog</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 animate-pulse rounded-lg bg-gray-200"></div>
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary-dark">
            Blog Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage the blog posts shown on your website.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New Blog Post
        </button>
      </div>

      <div className="mb-4">
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Search blogs..."
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {blogs.length > 0 ? (
        <>
          <p className="mb-2 text-xs text-gray-400">
            Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, totalCount)}{" "}
            of {totalCount} blogs
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-gray-600">
                <tr>
                  <th className="px-4 py-3">Blog</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="h-full w-full object-contain object-center"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gold">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2m0-1h.01"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/blog/edit/${blog.id}`}
                            className="font-medium text-gray-800 hover:text-primary hover:underline"
                          >
                            {blog.title}
                          </Link>
                          <p className="truncate text-xs text-gray-400">
                            {processBlogSummary(blog.summary, 80)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{blog.author}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(blog.date).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/blog/edit/${blog.id}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-xs font-semibold text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream">
            <svg
              className="h-8 w-8 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-primary-dark">
            No blogs found
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Get started by creating your first blog post
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Create Blog Post
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {page > 3 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="h-8 w-8 rounded-lg text-xs font-semibold text-gray-600 hover:bg-cream"
                >
                  1
                </button>
                {page > 4 && <span className="text-gray-400">...</span>}
              </>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return pageNum <= totalPages ? (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold ${
                    page === pageNum
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-cream"
                  }`}
                >
                  {pageNum}
                </button>
              ) : null;
            })}

            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && (
                  <span className="text-gray-400">...</span>
                )}
                <button
                  onClick={() => setPage(totalPages)}
                  className="h-8 w-8 rounded-lg text-xs font-semibold text-gray-600 hover:bg-cream"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="h-[80vh] w-[80vw] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <BlogForm
              onSuccess={() => {
                setIsModalOpen(false);
                fetchBlogs();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
