"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

async function requireAdmin() {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return auth;
}

export async function updateEnrollment(id: string, patch: Record<string, unknown>) {
  const auth = await requireAdmin();
  const payload: Record<string, unknown> = {};
  if ("paymentStatus" in patch) payload.payment_status = patch.paymentStatus;
  if ("enrollmentStatus" in patch) payload.enrollment_status = patch.enrollmentStatus;
  if ("adminNote" in patch) payload.admin_note = patch.adminNote;

  const enrollment = await api.enrollments.adminUpdate(id, payload, auth.token);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/courses");
  return enrollment;
}

export async function deleteEnrollment(id: string) {
  const auth = await requireAdmin();
  await api.enrollments.adminDelete(id, auth.token);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/courses");
}

export async function addEnrollmentResult(payload: {
  enrollmentId: string;
  examName: string;
  marks?: string | number;
  grade?: string;
  remarks?: string;
  examDate?: string;
}) {
  const auth = await requireAdmin();
  const result = await api.results.create(
    {
      enrollment_id: payload.enrollmentId,
      exam_name: payload.examName,
      marks: payload.marks === "" || payload.marks === undefined ? undefined : Number(payload.marks),
      grade: payload.grade || undefined,
      remarks: payload.remarks || undefined,
      exam_date: payload.examDate || undefined
    },
    auth.token
  );
  revalidatePath("/admin/courses");
  return result;
}

export async function deleteEnrollmentResult(resultId: string) {
  const auth = await requireAdmin();
  await api.results.delete(resultId, auth.token);
  revalidatePath("/admin/courses");
}
