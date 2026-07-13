import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/shared/JsonLd";
import CourseDetailView from "@/components/courses/CourseDetailView";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

async function getCourse(slug: string) {
  return prisma.course.findUnique({ where: { slug, isActive: true } }).catch(() => null);
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ select: { slug: true } }).catch(() => []);
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: course.metaTitle || course.title,
    description: course.metaDescription || course.description.slice(0, 160),
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.description.slice(0, 160),
      images: course.bannerImage ? [{ url: course.bannerImage }] : undefined
    }
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const reviews = await prisma.content
    .findMany({
      where: { type: "REVIEW", isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6
    })
    .catch(() => []);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Learn Al Quran Online BD",
      sameAs: siteUrl
    },
    offers: {
      "@type": "Offer",
      price: course.fee,
      priceCurrency: "BDT"
    }
  };

  return (
    <>
      <JsonLd data={courseJsonLd} />
      <CourseDetailView
        course={JSON.parse(JSON.stringify(course))}
        reviews={JSON.parse(JSON.stringify(reviews))}
      />
    </>
  );
}
