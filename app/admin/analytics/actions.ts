"use server";

import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";

export async function fetchAnalyticsSummary(params: { from: string; to: string; bucket: string }) {
  const auth = await getAuthSession();
  if (!auth || auth.session.user.role !== "ADMIN") throw new Error("Unauthorized");
  return api.analytics.summary(auth.token, params);
}
