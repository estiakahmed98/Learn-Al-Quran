"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import { CACHE_TAGS, invalidateTag } from "@/lib/cached-data";

type SavedBlog = Record<string, unknown> & { slug?: string };

type BlogActionResult =
  | { ok: true; blog: SavedBlog }
  | { ok: false; error: string };

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function createBlog(payload: Record<string, unknown>): Promise<BlogActionResult> {
  try {
    const auth = await requireAdmin();
    const blog = await api.blogs.adminCreate(payload, auth.token);
    invalidateTag(CACHE_TAGS.blogs);
    if (blog?.slug) invalidateTag(CACHE_TAGS.blog(blog.slug));
    revalidatePath("/admin/blog");
    return { ok: true, blog };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create the blog post."
    };
  }
}

export async function updateBlog(
  id: number | string,
  payload: Record<string, unknown>
): Promise<BlogActionResult> {
  try {
    const auth = await requireAdmin();
    const blog = await api.blogs.adminUpdate(id, payload, auth.token);
    invalidateTag(CACHE_TAGS.blogs);
    if (blog?.slug) invalidateTag(CACHE_TAGS.blog(blog.slug));
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/edit/${id}`);
    return { ok: true, blog };
  } catch (error) {
    console.error(`Failed to update blog ${id}:`, error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update the blog post."
    };
  }
}

export async function deleteBlog(id: number | string) {
  const auth = await requireAdmin();
  await api.blogs.adminDelete(id, auth.token);
  invalidateTag(CACHE_TAGS.blogs);
  revalidatePath("/admin/blog");
}

export async function listBlogsForAdmin(params?: { page?: number; perPage?: number }) {
  return api.blogs.list(params);
}

export async function uploadBlogImage(formData: FormData) {
  const auth = await requireAdmin();
  return api.uploads.store("blogImages", formData, auth.token);
}

export async function uploadBlogAd(formData: FormData) {
  const auth = await requireAdmin();
  return api.uploads.store("blogAds", formData, auth.token);
}
