"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function createUser(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const user = await api.users.adminCreate(payload, auth.token);
  revalidatePath("/admin/users");
  revalidatePath("/admin/students");
  return user;
}

export async function updateUser(id: string, payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const user = await api.users.adminUpdate(id, payload, auth.token);
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${id}`);
  return user;
}

export async function deleteUser(id: string) {
  const auth = await requireAdmin();
  await api.users.adminDelete(id, auth.token);
  revalidatePath("/admin/users");
  revalidatePath("/admin/students");
}

export async function uploadUserImage(formData: FormData) {
  const auth = await requireAdmin();
  return api.uploads.store("users", formData, auth.token);
}
