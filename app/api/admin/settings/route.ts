import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";
import { siteSettingSchema } from "@/lib/validation/site-setting";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/site-config";

export async function GET() {
  const session = await requireSectionAccess("SETTINGS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSetting.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await requireSectionAccess("SETTINGS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = siteSettingSchema.parse(body) as Prisma.SiteSettingUncheckedUpdateInput;

    const existing = await prisma.siteSetting.findFirst();
    const settings = existing
      ? await prisma.siteSetting.update({ where: { id: existing.id }, data })
      : await prisma.siteSetting.create({
          data: { id: "main", ...data } as Prisma.SiteSettingUncheckedCreateInput
        });

    revalidateTag(SITE_SETTINGS_CACHE_TAG);
    // Settings feed into layouts and JSON-LD across every route; a broad
    // revalidate keeps header/footer/hero copy in sync immediately.
    revalidatePath("/", "layout");

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid settings data.", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to save settings." }, { status: 500 });
  }
}
