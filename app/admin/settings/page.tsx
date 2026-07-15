import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findFirst().catch(() => null);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Manage site-wide content: header/footer identity, hero section, about us, payment details, location, and social links.
      </p>
      <SettingsForm initial={settings} />
    </div>
  );
}
