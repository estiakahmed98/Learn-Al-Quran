"use server";

import { api } from "@/lib/api-client";

export async function submitEnrollment(payload: Record<string, unknown>) {
  const { courseSlug, courseId, ...rest } = payload as Record<string, unknown> & {
    courseSlug?: string | null;
    courseId?: string | null;
  };
  const resolvedCourseId = courseId || (courseSlug ? (await api.courses.getBySlug(courseSlug)).id : undefined);
  return api.enrollments.create({ ...rest, course_id: resolvedCourseId });
}

export async function submitTrialApplication(payload: Record<string, unknown>) {
  const { courseSlug, courseId, ...rest } = payload as Record<string, unknown> & {
    courseSlug?: string | null;
    courseId?: string | null;
  };
  const resolvedCourseId = courseId || (courseSlug ? (await api.courses.getBySlug(courseSlug)).id : undefined);
  return api.trialApplications.create({ ...rest, course_id: resolvedCourseId });
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
