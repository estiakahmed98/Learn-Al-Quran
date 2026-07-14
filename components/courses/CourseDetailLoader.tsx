"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import JsonLd from "@/components/shared/JsonLd";
import CourseDetailView, {
  type SerializedCourse,
  type SerializedReview
} from "@/components/courses/CourseDetailView";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://learnalquranonlinebd.com";

export default function CourseDetailLoader({
  slug,
  reviews
}: {
  slug: string;
  reviews: SerializedReview[];
}) {
  const t = useTranslations("courseDetail");
  const [course, setCourse] = useState<SerializedCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourse() {
      try {
        const response = await fetch(`/api/courses/${encodeURIComponent(slug)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Failed to fetch course");

        setCourse((await response.json()) as SerializedCourse);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCourse(null);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCourse();
    return () => controller.abort();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8" aria-label={t("loading")}>
        <div className="h-96 animate-pulse rounded-2xl bg-primary/10" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-primary-dark">{t("notFound")}</h1>
        <p className="mt-3 text-gray-500">{t("unavailable")}</p>
      </div>
    );
  }

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
      <CourseDetailView course={course} reviews={reviews} />
    </>
  );
}
