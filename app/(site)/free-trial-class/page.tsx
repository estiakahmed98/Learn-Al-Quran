import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import FreeTrialApplication from "@/components/trial/FreeTrialApplication";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Free Trial Class",
  description:
    "Book your free trial class with Learn Al Quran Online BD. Experience our live one-to-one Quran, Tajweed and Hifz teaching before you enroll.",
  alternates: { canonical: "/free-trial-class" }
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { course?: string };
}

export default async function FreeTrialClassPage({ searchParams }: Props) {
  const [session, locale, courses] = await Promise.all([
    getServerSession(authOptions),
    getLocale(),
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, titleBn: true, slug: true }
    }).catch(() => [])
  ]);
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true } })
    : null;
  const application = user
    ? await prisma.trialApplication.findFirst({
        where: { userId: user.id, user: { role: "STUDENT" }, status: { not: "CANCELLED" } },
        include: {
          course: { select: { title: true, titleBn: true } }
        },
        orderBy: { createdAt: "desc" }
      })
    : null;
  const defaultCourseId = courses.find((course) => course.slug === searchParams.course)?.id;

  return (
    <FreeTrialApplication
      courses={courses}
      defaultCourseId={defaultCourseId}
      user={user ? { name: user.name, email: user.email } : null}
      application={application}
      isBangla={locale === "bn"}
    />
  );
}
