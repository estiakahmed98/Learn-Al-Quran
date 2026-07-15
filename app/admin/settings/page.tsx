import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessSection } from "@/lib/permissions";
import SettingsTabs from "@/components/admin/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  const role = session!.user.role;
  const permissions = session!.user.permissions;

  const canSettings = canAccessSection(role, permissions, "SETTINGS");
  const canContent = canAccessSection(role, permissions, "CONTENT");

  const [settings, content, teachers] = await Promise.all([
    canSettings ? prisma.siteSetting.findFirst().catch(() => null) : Promise.resolve(null),
    canContent
      ? prisma.content
          .findMany({
            where: { type: { not: "TEACHER" } },
            orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
          })
          .catch(() => [])
      : Promise.resolve([]),
    canContent
      ? prisma.user
          .findMany({
            where: { role: "TEACHER" },
            select: {
              id: true,
              name: true,
              email: true,
              designation: true,
              description: true,
              imageURL: true,
              isActive: true,
            },
            orderBy: { createdAt: "desc" },
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <SettingsTabs
      settings={settings}
      content={JSON.parse(JSON.stringify(content))}
      teachers={JSON.parse(JSON.stringify(teachers))}
      canSettings={canSettings}
      canContent={canContent}
    />
  );
}
