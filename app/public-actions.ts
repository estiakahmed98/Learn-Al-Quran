"use server";

import { api, ApiError } from "@/lib/api-client";
import { sendAdminNotification } from "@/lib/admin-notification";

function textValue(value: unknown): string | number | null | undefined {
  return typeof value === "string" || typeof value === "number" || value == null
    ? value
    : String(value);
}

export async function submitEnrollment(payload: Record<string, unknown>) {
  try {
    const { courseSlug, courseId, ...rest } = payload as Record<string, unknown> & {
      courseSlug?: string | null;
      courseId?: string | null;
    };
    const resolvedCourseId = courseId || (courseSlug ? (await api.courses.getBySlug(courseSlug)).id : undefined);
    const enrollment = await api.enrollments.create({ ...rest, course_id: resolvedCourseId });

    await sendAdminNotification({
      subject: `New enrollment: ${textValue(rest.studentName) || "Student"}`,
      heading: "A new enrollment application was submitted",
      replyTo: typeof rest.email === "string" ? rest.email : null,
      fields: {
        "Student name": textValue(rest.studentName),
        "Guardian name": textValue(rest.guardianName),
        Email: textValue(rest.email),
        Phone: textValue(rest.contactNumber ?? rest.whatsappNumber ?? rest.phone),
        Course: textValue(enrollment?.course?.title ?? courseSlug ?? resolvedCourseId),
        "Payment method": textValue(rest.paymentMethod),
        "Transaction ID": textValue(rest.transactionId),
        "Application ID": textValue(enrollment?.id),
      },
    });

    return { ok: true } as const;
  } catch (error) {
    console.error("[submitEnrollment] failed", error);

    return {
      ok: false,
      error:
        error instanceof ApiError && error.status >= 400 && error.status < 500
          ? error.message
          : "Unable to submit the enrollment. Please try again.",
    } as const;
  }
}

export async function submitTrialApplication(payload: Record<string, unknown>) {
  const { courseSlug, courseId, ...rest } = payload as Record<string, unknown> & {
    courseSlug?: string | null;
    courseId?: string | null;
  };
  const resolvedCourseId = courseId || (courseSlug ? (await api.courses.getBySlug(courseSlug)).id : undefined);
  const application = await api.trialApplications.create({ ...rest, course_id: resolvedCourseId });

  await sendAdminNotification({
    subject: `New free-trial application: ${textValue(rest.studentName) || "Student"}`,
    heading: "A new free-trial application was submitted",
    replyTo: typeof rest.email === "string" ? rest.email : null,
    fields: {
      "Student name": textValue(rest.studentName),
      "Guardian name": textValue(rest.guardianName),
      "Student age": textValue(rest.studentAge),
      Mobile: textValue(rest.mobileNumber),
      WhatsApp: textValue(rest.whatsappNumber),
      Email: textValue(rest.email),
      Country: textValue(rest.country),
      Course: textValue(application?.course?.title ?? courseSlug ?? resolvedCourseId),
      "Preferred date": textValue(rest.preferredDate),
      "Preferred time": textValue(rest.preferredTime),
      Note: textValue(rest.note),
      "Application ID": textValue(application?.id),
    },
  });

  return application;
}

export async function listBooks() {
  return api.content.list("BOOK");
}

export async function listReviews() {
  return api.content.list("REVIEW");
}

export async function submitReview(payload: { name: string; role?: string; message: string; rating: number }) {
  return api.content.submitReview(payload);
}
