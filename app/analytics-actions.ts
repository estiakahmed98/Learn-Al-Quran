"use server";

import { api } from "@/lib/api-client";

export async function collectAnalyticsEvent(payload: unknown) {
  try {
    await api.analytics.collect(payload);
  } catch {
    // best-effort tracking beacon; ignore failures
  }
}
