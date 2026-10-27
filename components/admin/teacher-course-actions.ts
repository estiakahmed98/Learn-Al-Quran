"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import { CACHE_TAGS } from "@/lib/cached-data";

export async function changeTeacherCourseAssignment(payload: { teacherId: string; courseId: string; remove: boolean }) {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const course = payload.remove
    ? await api.courses.removeTeacher(payload.courseId, payload.teacherId, auth.token)
    : await api.courses.assignTeacher(payload.courseId, payload.teacherId, auth.token);

  updateTag(CACHE_TAGS.courses);
  if (course?.slug) updateTag(CACHE_TAGS.course(course.slug));
  revalidatePath(`/admin/users/${payload.teacherId}`);
  revalidatePath(`/admin/courses/${payload.courseId}`);
  revalidatePath("/teacher");
  revalidatePath("/teacher/classes");
}
