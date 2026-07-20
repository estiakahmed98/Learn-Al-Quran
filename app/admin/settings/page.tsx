import { prisma } from "@/lib/prisma";
import SettingsTabs from "@/components/admin/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, content] = await Promise.all([
    prisma.siteSetting.findFirst().catch(() => null),
    prisma.content
      .findMany({
        where: { type: { in: ["REVIEW", "FAQ", "BOOK"] } },
        orderBy: [{ type: "asc" }, { sortOrder: "asc" }]
      })
      .catch(() => [])
  ]);

  return <SettingsTabs settings={settings} content={JSON.parse(JSON.stringify(content))} />;
}
