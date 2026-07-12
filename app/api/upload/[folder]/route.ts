import { uploadImage } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ folder: string }> },
) {
  const { folder } = await params;
  return uploadImage(req, folder);
}
