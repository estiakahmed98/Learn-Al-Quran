"use client";

import { useEffect, useState } from "react";

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  description: string;
  descriptionBn: string | null;
  thumbnail: string | null;
  category: string | null;
  categoryBn: string | null;
  level: string | null;
  levelBn: string | null;
  classType: string | null;
  classTypeBn: string | null;
  duration: string | null;
  fee: number;
  originalFee: number | null;
}

export function useCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch("/api/courses", { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch courses");

        setCourses((await response.json()) as CourseListItem[]);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCourses([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCourses();
    return () => controller.abort();
  }, []);

  return { courses, isLoading };
}
