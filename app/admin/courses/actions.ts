"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import { CACHE_TAGS, invalidateTag } from "@/lib/cached-data";

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function createCourse(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const course = await api.courses.adminCreate(payload, auth.token);
  invalidateTag(CACHE_TAGS.courses);
  if (course?.slug) invalidateTag(CACHE_TAGS.course(course.slug));
  revalidatePath("/admin/courses");
  return course;
}

export async function updateCourse(id: string, payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const course = await api.courses.adminUpdate(id, payload, auth.token);
  invalidateTag(CACHE_TAGS.courses);
  if (course?.slug) invalidateTag(CACHE_TAGS.course(course.slug));
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  return course;
}

export async function deleteCourse(id: string) {
  const auth = await requireAdmin();
  await api.courses.adminDelete(id, auth.token);
  invalidateTag(CACHE_TAGS.courses);
  revalidatePath("/admin/courses");
}

export async function uploadCourseImage(formData: FormData) {
  const auth = await requireAdmin();
  return api.uploads.store("courses", formData, auth.token);
}

export async function addClassSchedule(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const schedule = await api.classSchedules.create(payload, auth.token);
  const courseId = payload.courseId as string | undefined;
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  return schedule;
}

export async function updateClassSchedule(id: string, payload: Record<string, unknown>, courseId?: string) {
  const auth = await requireAdmin();
  const schedule = await api.classSchedules.update(id, payload, auth.token);
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  return schedule;
}

export async function deleteClassSchedule(id: string, courseId?: string) {
  const auth = await requireAdmin();
  await api.classSchedules.delete(id, auth.token);
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
}

export async function addNote(payload: Record<string, unknown>) {
  const auth = await requireAdmin();
  const note = await api.notes.create(payload, auth.token);
  const courseId = payload.courseId as string | undefined;
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  return note;
}

export async function updateNote(id: string, payload: Record<string, unknown>, courseId?: string) {
  const auth = await requireAdmin();
  const note = await api.notes.update(id, payload, auth.token);
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
  return note;
}

export async function deleteNote(id: string, courseId?: string) {
  const auth = await requireAdmin();
  await api.notes.delete(id, auth.token);
  if (courseId) revalidatePath(`/admin/courses/${courseId}`);
}
