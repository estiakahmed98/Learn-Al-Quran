"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CourseFormValues {
  title: string;
  slug: string;
  description: string;
  fee: number;
  duration: string;
  thumbnail: string;
  bannerImage: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

const emptyValues: CourseFormValues = {
  title: "",
  slug: "",
  description: "",
  fee: 1500,
  duration: "",
  thumbnail: "",
  bannerImage: "",
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
  metaTitle: "",
  metaDescription: ""
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CourseForm({
  courseId,
  initial,
  onSaved
}: {
  courseId?: string;
  initial?: Partial<CourseFormValues>;
  onSaved?: (course: any) => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CourseFormValues>({ ...emptyValues, ...initial });
  const [slugTouched, setSlugTouched] = useState(Boolean(courseId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim() || slugify(values.title),
      description: values.description.trim(),
      fee: Number(values.fee) || 0,
      duration: values.duration.trim() || null,
      thumbnail: values.thumbnail.trim() || null,
      bannerImage: values.bannerImage.trim() || null,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      metaTitle: values.metaTitle.trim() || null,
      metaDescription: values.metaDescription.trim() || null
    };

    const res = await fetch(courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses", {
      method: courseId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to save. The slug may already be in use.");
      return;
    }

    const course = await res.json();
    setSaved(true);
    onSaved?.(course);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none";
  const labelClass = "mb-1 block text-xs font-semibold text-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            value={values.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            className={inputClass}
            placeholder="e.g. Noorani Qaida Course"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Slug *</label>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            className={inputClass}
            placeholder="noorani-qaida-course"
          />
          <p className="mt-1 text-xs text-gray-400">URL: /courses/{values.slug || "..."}</p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Fee (৳)</label>
          <input
            type="number"
            min={0}
            value={values.fee}
            onChange={(e) => set("fee", Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Duration</label>
          <input
            value={values.duration}
            onChange={(e) => set("duration", e.target.value)}
            className={inputClass}
            placeholder="e.g. 3 Months"
          />
        </div>

        <div>
          <label className={labelClass}>Thumbnail URL</label>
          <input
            value={values.thumbnail}
            onChange={(e) => set("thumbnail", e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Banner Image URL</label>
          <input
            value={values.bannerImage}
            onChange={(e) => set("bannerImage", e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Sort Order</label>
          <input
            type="number"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div className="flex items-end gap-6 pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        <div>
          <label className={labelClass}>Meta Title (SEO)</label>
          <input
            value={values.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Meta Description (SEO)</label>
          <input
            value={values.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : courseId ? "Save Changes" : "Create Course"}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
