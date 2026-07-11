import { prisma } from "@/lib/prisma";
import ContentManager from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const content = await prisma.content.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }]
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Content</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage Teachers, Reviews, FAQ, Blog posts, and Books shown across your site.
      </p>

      <div className="mt-6">
        <ContentManager initialContent={JSON.parse(JSON.stringify(content))} />
      </div>
    </div>
  );
}
