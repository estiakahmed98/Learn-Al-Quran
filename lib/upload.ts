import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["blogImages", "blogAds", "content", "courses"]);
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function uploadImage(req: Request, folder?: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (folder && !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const extension = EXTENSIONS[file.type];
    if (!extension) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    const relativeDirectory = folder ? path.join("uploads", folder) : "uploads";
    const directory = path.join(process.cwd(), "public", relativeDirectory);
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;
    const destination = path.join(directory, filename);

    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(destination, new Uint8Array(await file.arrayBuffer()));

    const url = `/${relativeDirectory.replace(/\\/g, "/")}/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[upload] failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
