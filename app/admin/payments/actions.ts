"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

export async function setEnrollmentPaymentStatus(id: string, reject: boolean) {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const enrollment = await api.enrollments.adminUpdate(
    id,
    {
      payment_status: reject ? "REJECTED" : "VERIFIED",
      enrollment_status: reject ? "CANCELLED" : "ACTIVE"
    },
    auth.token
  );

  revalidatePath("/admin/payments");
  revalidatePath("/admin/students");
  return enrollment;
}
