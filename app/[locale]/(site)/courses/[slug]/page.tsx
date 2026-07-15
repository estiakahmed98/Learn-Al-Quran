import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import CourseDetailLoader from "@/components/courses/CourseDetailLoader";
import { pickText } from "@/lib/course-content";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [course, locale] = await Promise.all([
    prisma.course.findUnique({ where: { slug: params.slug } }).catch(() => null),
    getLocale()
  ]);

  if (!course) {
    return {
      title: "Course Details",
      description: "View course details, curriculum, schedule and enrollment information.",
      alternates: buildAlternates(`/courses/${params.slug}`)
    };
  }

  const title = course.metaTitle || pickText(locale, course.title, course.titleBn);
  const description =
    course.metaDescription || pickText(locale, course.description, course.descriptionBn);
  const image = course.thumbnail || course.bannerImage;

  return {
    title,
    description,
    alternates: buildAlternates(`/courses/${params.slug}`),
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [{ url: image }] : undefined
    }
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const [reviews, course] = await Promise.all([
    prisma.content
      .findMany({
        where: { type: "REVIEW", isPublished: true },
        orderBy: { sortOrder: "asc" },
        take: 6
      })
      .catch(() => []),
    prisma.course.findUnique({ where: { slug: params.slug } }).catch(() => null)
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Courses", url: `${siteUrl}/courses` },
    { name: course?.title || params.slug, url: `${siteUrl}/courses/${params.slug}` }
  ]);

  const courseJsonLd = course
    ? {
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
      }
    : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {courseJsonLd && <JsonLd data={courseJsonLd} />}
      <CourseDetailLoader
        slug={params.slug}
        reviews={JSON.parse(JSON.stringify(reviews))}
      />
    </>
  );
}
