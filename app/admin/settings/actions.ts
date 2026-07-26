"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/site-config";
import { CACHE_TAGS, invalidateTag } from "@/lib/cached-data";

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function updateSiteSettings(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const settings = await api.settings.update(payload, auth.token);
  invalidateTag(SITE_SETTINGS_CACHE_TAG);
  revalidatePath("/admin/settings");
  return settings;
}

export async function uploadSettingsImage(
  formData: FormData,
  collection: "general" | "hero" | "organization" = "general"
) {
  const auth = await requireAdmin();
  return api.uploads.store(collection, formData, auth.token);
}

export async function createContentItem(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const item = await api.content.adminCreate(payload, auth.token);
  invalidateTag(CACHE_TAGS.content(String(payload.type ?? "")));
  revalidatePath("/admin/settings");
  return item;
}

export async function updateContentItem(id: string, payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const item = await api.content.adminUpdate(id, payload, auth.token);
  invalidateTag(CACHE_TAGS.content(String(item.type ?? "")));
  revalidatePath("/admin/settings");
  return item;
}

export async function deleteContentItem(id: string, type: string) {
  const auth = await requireAdmin();
  await api.content.adminDelete(id, auth.token);
  invalidateTag(CACHE_TAGS.content(type));
  revalidatePath("/admin/settings");
}
