import { prisma } from "@/lib/prisma";
import ContentManager from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [content, teachers] = await Promise.all([
    prisma.content.findMany({
      where: { type: { not: "TEACHER" } },
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }]
    }).catch(() => []),
    prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        description: true,
        imageURL: true,
        isActive: true
      },
      orderBy: { createdAt: "desc" }
    }).catch(() => [])
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Content</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage Teachers, Reviews, FAQ, Blog posts, and Books shown across your site.
      </p>

      <div className="mt-6">
        <ContentManager
          initialContent={JSON.parse(JSON.stringify(content))}
          initialTeachers={JSON.parse(JSON.stringify(teachers))}
        />
      </div>
    </div>
  );
}
