import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getCachedCourseBySlug } from "@/lib/cached-data";
import CourseDetailView, { type SerializedCourse, type SerializedReview } from "@/components/courses/CourseDetailView";
import { pickText } from "@/lib/course-content";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// See app/[locale]/(site)/blog/[slug]/page.tsx for why this is needed:
// non-ASCII dynamic segments can arrive still percent-encoded here.
function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function serializeCourse(course: NonNullable<Awaited<ReturnType<typeof getCachedCourseBySlug>>>): SerializedCourse {
  return {
    id: course.id,
    title: course.title,
    titleBn: course.titleBn,
    slug: course.slug,
    description: course.description,
    descriptionBn: course.descriptionBn,
    thumbnail: course.thumbnail,
    bannerImage: course.bannerImage,
    category: course.category,
    categoryBn: course.categoryBn,
    courseType: course.courseType,
    courseTypeBn: course.courseTypeBn,
    classType: course.classType,
    classTypeBn: course.classTypeBn,
    level: course.level,
    levelBn: course.levelBn,
    instructorName: course.instructorName,
    totalLessons: course.totalLessons,
    totalHours: course.totalHours,
    startDate: course.startDate ? course.startDate.toISOString() : null,
    enrollDeadline: course.enrollDeadline ? course.enrollDeadline.toISOString() : null,
    fee: course.fee,
    originalFee: course.originalFee,
    couponCode: course.couponCode,
    couponPercent: course.couponPercent,
    certificate: course.certificate,
    duration: course.duration,
    curriculum: course.curriculum,
    learnPoints: course.learnPoints,
    features: course.features,
    whyCards: course.whyCards,
    faqs: course.faqs
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeSlug(params.slug);
  const [course, locale] = await Promise.all([
    getCachedCourseBySlug(slug).catch(() => null),
    getLocale()
  ]);

  if (!course) {
    return {
      title: "Course Details",
      description: "View course details, curriculum, schedule and enrollment information.",
      alternates: buildAlternates(`/courses/${slug}`)
    };
  }

  const title = course.metaTitle || pickText(locale, course.title, course.titleBn);
  const description =
    course.metaDescription || pickText(locale, course.description, course.descriptionBn);
  const image = course.thumbnail || course.bannerImage;

  return {
    title,
    description,
    alternates: buildAlternates(`/courses/${course.slug}`),
    openGraph: {
      type: "website",
      title,
      description,
      images: image ? [{ url: image }] : undefined
    }
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const slug = decodeSlug(params.slug);
  const [reviews, course] = await Promise.all([
    prisma.content
      .findMany({
        where: { type: "REVIEW", isPublished: true },
        orderBy: { sortOrder: "asc" },
        take: 6
      })
      .catch(() => []),
    getCachedCourseBySlug(slug).catch(() => null)
  ]);

  if (!course) {
    notFound();
  }

  const serializedCourse = serializeCourse(course);
  const serializedReviews: SerializedReview[] = reviews.map((review) => ({
    id: review.id,
    title: review.title,
    subtitle: review.subtitle,
    description: review.description,
    data: review.data
  }));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Courses", url: `${siteUrl}/courses` },
    { name: course.title, url: `${siteUrl}/courses/${course.slug}` }
  ]);

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
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={courseJsonLd} />
      <CourseDetailView course={serializedCourse} reviews={serializedReviews} />
    </>
  );
}
