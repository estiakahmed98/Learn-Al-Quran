"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

/** Assigns a course to a user on the admin's behalf via POST /admin/enrollments. */
export async function assignCourseToUser(payload: {
  userId: string;
  courseId: string;
  adminNote?: string;
}) {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const enrollment = await api.enrollments.adminCreate(
    {
      user_id: payload.userId,
      course_id: payload.courseId,
      admin_note: payload.adminNote
    },
    auth.token
  );

  revalidatePath(`/admin/users/${payload.userId}`);
  revalidatePath(`/admin/students/${payload.userId}`);
  return enrollment;
}
