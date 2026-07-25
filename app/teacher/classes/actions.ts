"use server";

import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

export async function submitClassReport(payload: {
  courseId: string;
  classDate: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  attended?: string | number;
  notes?: string;
}) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");

  return api.classReports.create(
    {
      course_id: payload.courseId,
      class_date: payload.classDate,
      start_time: payload.startTime,
      end_time: payload.endTime || undefined,
      completed: payload.completed,
      attended: payload.attended === "" || payload.attended === undefined ? undefined : Number(payload.attended),
      notes: payload.notes || undefined
    },
    auth.token
  );
}
