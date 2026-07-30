"use server";

import { api } from "@/lib/api-client";

export async function collectAnalyticsEvent(payload: unknown) {
  try {
    await api.analytics.collect(payload);
  } catch (error) {
    console.error("[analytics:collect] failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
