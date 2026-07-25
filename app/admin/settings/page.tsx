import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import SettingsTabs from "@/components/admin/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const auth = await getAuthSession();
  if (!auth) redirect("/auth/login?callbackUrl=/admin/settings");

  const [settings, reviewContent, faqContent, bookContent] = await Promise.all([
    api.settings.get().catch(() => null),
    api.content.list("REVIEW", auth.token).catch(() => ({ data: [] as any[] })),
    api.content.list("FAQ", auth.token).catch(() => ({ data: [] as any[] })),
    api.content.list("BOOK", auth.token).catch(() => ({ data: [] as any[] }))
  ]);

  const content = [...reviewContent.data, ...faqContent.data, ...bookContent.data];

  return <SettingsTabs settings={settings} content={content} />;
}
