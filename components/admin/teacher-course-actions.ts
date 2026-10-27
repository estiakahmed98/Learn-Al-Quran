"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api, ApiError } from "@/lib/api-client";
import { CACHE_TAGS } from "@/lib/cached-data";

type AssignmentResult =
  | { ok: true; warning?: string }
  | { ok: false; error: string };

export async function changeTeacherCourseAssignment(payload: { teacherId: string; courseId: string; remove: boolean }): Promise<AssignmentResult> {
  let course: { slug?: string };
  try {
    const auth = await getAuthSession();
    if (!auth) return { ok: false, error: "Your session has expired. Please sign in again." };
    if (auth.session.user.role !== "ADMIN") return { ok: false, error: "Only admins can change teacher assignments." };

    course = payload.remove
      ? await api.courses.removeTeacher(payload.courseId, payload.teacherId, auth.token)
      : await api.courses.assignTeacher(payload.courseId, payload.teacherId, auth.token);
  } catch (error) {
    // Thrown Server Action errors are redacted in production. Return expected
    // failures as data so the form can show a useful message instead of #441.
    console.error("Teacher course assignment request failed", error);
    if (error instanceof ApiError) {
      if (error.status === 401) return { ok: false, error: "Your session has expired. Please sign in again." };
      if (error.status === 403) return { ok: false, error: "The backend denied this assignment. Check your admin access." };
      if (error.status === 404 || error.status === 405) {
        return { ok: false, error: "The assignment API or selected course/teacher was not found. Check the uploaded backend routes and clear the Laravel route cache." };
      }
      if (error.status === 422) return { ok: false, error: error.message };
      return { ok: false, error: `The backend returned HTTP ${error.status}. Check the Laravel log for the assignment error.` };
    }
    return { ok: false, error: "Could not reach the assignment service. Check the frontend server logs and try again." };
  }

  try {
    updateTag(CACHE_TAGS.courses);
    if (course?.slug) updateTag(CACHE_TAGS.course(course.slug));
    revalidatePath(`/admin/users/${payload.teacherId}`);
    revalidatePath(`/admin/courses/${payload.courseId}`);
    revalidatePath("/teacher");
    revalidatePath("/teacher/classes");
  } catch (error) {
    console.error("Teacher course assignment saved, but cache refresh failed", error);
    return { ok: true, warning: "Assignment saved, but the page could not refresh. Reload the page to see the latest assignments." };
  }
  return { ok: true };
}
