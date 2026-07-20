"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import type { BiText, CurriculumSection, WhyCard } from "@/lib/course-content";
import { BiListEditor, CurriculumEditor, WhyCardsEditor } from "@/components/admin/course-editors";

export interface CourseFormValues {
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  category: string;
  categoryBn: string;
  courseType: string;
  courseTypeBn: string;
  classType: string;
  classTypeBn: string;
  level: string;
  levelBn: string;
  instructorName: string;
  instructorId: string;
  totalLessons: string;
  totalHours: string;
  startDate: string; // yyyy-mm-dd
  enrollDeadline: string; // yyyy-mm-dd
  fee: number;
  originalFee: string;
  couponCode: string;
  couponPercent: string;
  certificate: boolean;
  duration: string;
  thumbnail: string;
  bannerImage: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  learnPoints: BiText[];
  features: BiText[];
  whyCards: WhyCard[];
  curriculumSections: CurriculumSection[];
}

const emptyValues: CourseFormValues = {
  title: "",
  titleBn: "",
  slug: "",
  description: "",
  descriptionBn: "",
  category: "",
  categoryBn: "",
  courseType: "",
  courseTypeBn: "",
  classType: "",
  classTypeBn: "",
  level: "",
  levelBn: "",
  instructorName: "",
  instructorId: "",
  totalLessons: "",
  totalHours: "",
  startDate: "",
  enrollDeadline: "",
  fee: 1500,
  originalFee: "",
  couponCode: "",
  couponPercent: "",
  certificate: true,
  duration: "",
  thumbnail: "",
  bannerImage: "",
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
  metaTitle: "",
  metaDescription: "",
  learnPoints: [],
  features: [],
  whyCards: [],
  curriculumSections: []
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
  onSaved,
  teachers = []
}: {
  courseId?: string;
  initial?: Partial<CourseFormValues>;
  onSaved?: (course: any) => void;
  teachers?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<CourseFormValues>({ ...emptyValues, ...initial });
  const [slugTouched, setSlugTouched] = useState(Boolean(courseId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function uploadFile(
    e: ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "bannerImage",
    setUploading: (v: boolean) => void,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload/courses", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      if (!data.url) throw new Error("Invalid upload response: url missing");

      set(field, data.url);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const learnPoints = values.learnPoints.filter((p) => p.en.trim() || p.bn.trim());
    const features = values.features.filter((f) => f.en.trim() || f.bn.trim());
    const whyCards = values.whyCards.filter(
      (c) => c.titleEn.trim() || c.titleBn.trim() || c.bodyEn.trim() || c.bodyBn.trim()
    );
    const sections = values.curriculumSections
      .map((s) => ({
        ...s,
        lessons: s.lessons.filter((l) => l.titleEn.trim() || l.titleBn.trim())
      }))
      .filter((s) => s.titleEn.trim() || s.titleBn.trim() || s.lessons.length);

    const payload = {
      title: values.title.trim(),
      titleBn: values.titleBn.trim() || null,
      slug: values.slug.trim() || slugify(values.title),
      description: values.description.trim(),
      descriptionBn: values.descriptionBn.trim() || null,
      category: values.category.trim() || null,
      categoryBn: values.categoryBn.trim() || null,
      courseType: values.courseType.trim() || null,
      courseTypeBn: values.courseTypeBn.trim() || null,
      classType: values.classType.trim() || null,
      classTypeBn: values.classTypeBn.trim() || null,
      level: values.level.trim() || null,
      levelBn: values.levelBn.trim() || null,
      instructorName: values.instructorName.trim() || null,
      instructorId: values.instructorId || null,
      totalLessons: values.totalLessons ? Number(values.totalLessons) : null,
      totalHours: values.totalHours ? Number(values.totalHours) : null,
      startDate: values.startDate ? new Date(values.startDate).toISOString() : null,
      enrollDeadline: values.enrollDeadline ? new Date(values.enrollDeadline).toISOString() : null,
      fee: Number(values.fee) || 0,
      originalFee: values.originalFee ? Number(values.originalFee) : null,
      couponCode: values.couponCode.trim() || null,
      couponPercent: values.couponPercent ? Number(values.couponPercent) : null,
      certificate: values.certificate,
      duration: values.duration.trim() || null,
      thumbnail: values.thumbnail.trim() || null,
      bannerImage: values.bannerImage.trim() || null,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      metaTitle: values.metaTitle.trim() || null,
      metaDescription: values.metaDescription.trim() || null,
      learnPoints: learnPoints.length ? learnPoints : null,
      features: features.length ? features : null,
      whyCards: whyCards.length ? whyCards : null,
      curriculum: sections.length ? { sections } : null
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
  const sectionClass = "border-t border-gray-100 pt-5";
  const sectionTitleClass = "mb-3 text-sm font-bold text-primary-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ---------- Basic info ---------- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title (English) *</label>
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

        <div>
          <label className={labelClass}>Title (বাংলা)</label>
          <input
            value={values.titleBn}
            onChange={(e) => set("titleBn", e.target.value)}
            className={inputClass}
            placeholder="যেমন: নূরানী কায়দা কোর্স"
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

        <div>
          <label className={labelClass}>Description (English) *</label>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description (বাংলা)</label>
          <textarea
            rows={4}
            value={values.descriptionBn}
            onChange={(e) => set("descriptionBn", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ---------- Badges & labels ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Badges &amp; Labels (shown on details page)</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Category (EN)</label>
            <input value={values.category} onChange={(e) => set("category", e.target.value)} className={inputClass} placeholder="Hadith" />
          </div>
          <div>
            <label className={labelClass}>Category (বাংলা)</label>
            <input value={values.categoryBn} onChange={(e) => set("categoryBn", e.target.value)} className={inputClass} placeholder="হাদিস" />
          </div>
          <div>
            <label className={labelClass}>Course Type (EN)</label>
            <input value={values.courseType} onChange={(e) => set("courseType", e.target.value)} className={inputClass} placeholder="Short Course" />
          </div>
          <div>
            <label className={labelClass}>Course Type (বাংলা)</label>
            <input value={values.courseTypeBn} onChange={(e) => set("courseTypeBn", e.target.value)} className={inputClass} placeholder="শর্ট কোর্স" />
          </div>
          <div>
            <label className={labelClass}>Class Type (EN)</label>
            <input value={values.classType} onChange={(e) => set("classType", e.target.value)} className={inputClass} placeholder="Live" />
          </div>
          <div>
            <label className={labelClass}>Class Type (বাংলা)</label>
            <input value={values.classTypeBn} onChange={(e) => set("classTypeBn", e.target.value)} className={inputClass} placeholder="লাইভ" />
          </div>
          <div>
            <label className={labelClass}>Level (EN)</label>
            <input value={values.level} onChange={(e) => set("level", e.target.value)} className={inputClass} placeholder="Beginner" />
          </div>
          <div>
            <label className={labelClass}>Level (বাংলা)</label>
            <input value={values.levelBn} onChange={(e) => set("levelBn", e.target.value)} className={inputClass} placeholder="প্রাথমিক" />
          </div>
        </div>
      </div>

      {/* ---------- Course meta ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Course Info</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Assigned Teacher</label>
            <select
              value={values.instructorId}
              onChange={(e) => {
                const teacher = teachers.find((t) => t.id === e.target.value);
                set("instructorId", e.target.value);
                if (teacher) set("instructorName", teacher.name);
              }}
              className={inputClass}
            >
              <option value="">— Not assigned —</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Instructor Name (display)</label>
            <input value={values.instructorName} onChange={(e) => set("instructorName", e.target.value)} className={inputClass} placeholder="Ustad ..." />
          </div>
          <div>
            <label className={labelClass}>Total Lessons</label>
            <input type="number" min={0} value={values.totalLessons} onChange={(e) => set("totalLessons", e.target.value)} className={inputClass} placeholder="40" />
          </div>
          <div>
            <label className={labelClass}>Total Hours</label>
            <input type="number" min={0} value={values.totalHours} onChange={(e) => set("totalHours", e.target.value)} className={inputClass} placeholder="40" />
          </div>
          <div>
            <label className={labelClass}>Class Start Date</label>
            <input type="date" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Enrollment Deadline</label>
            <input type="date" value={values.enrollDeadline} onChange={(e) => set("enrollDeadline", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Duration (text)</label>
            <input value={values.duration} onChange={(e) => set("duration", e.target.value)} className={inputClass} placeholder="e.g. 3 Months" />
          </div>
        </div>
      </div>

      {/* ---------- Pricing ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Pricing &amp; Coupon</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Fee (৳) *</label>
            <input type="number" min={0} value={values.fee} onChange={(e) => set("fee", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Original Fee (৳, strikethrough)</label>
            <input type="number" min={0} value={values.originalFee} onChange={(e) => set("originalFee", e.target.value)} className={inputClass} placeholder="2000" />
            <p className="mt-1 text-xs text-gray-400">Discount % is calculated automatically.</p>
          </div>
          <div>
            <label className={labelClass}>Coupon Code</label>
            <input value={values.couponCode} onChange={(e) => set("couponCode", e.target.value.toUpperCase())} className={inputClass} placeholder="HADIS25" />
          </div>
          <div>
            <label className={labelClass}>Coupon Discount (%)</label>
            <input type="number" min={0} max={100} value={values.couponPercent} onChange={(e) => set("couponPercent", e.target.value)} className={inputClass} placeholder="25" />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={values.certificate} onChange={(e) => set("certificate", e.target.checked)} className="h-4 w-4" />
          Certificate provided after course completion
        </label>
      </div>

      {/* ---------- What you'll learn ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>What You&apos;ll Learn (checklist)</h3>
        <BiListEditor
          items={values.learnPoints}
          onChange={(items) => set("learnPoints", items)}
          enPlaceholder="e.g. Iman & pure Aqeedah"
          bnPlaceholder="যেমন: ঈমান ও বিশুদ্ধ আকিদা"
          addLabel="Add learning point"
        />
      </div>

      {/* ---------- What you get ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>What You Get (features)</h3>
        <BiListEditor
          items={values.features}
          onChange={(items) => set("features", items)}
          enPlaceholder="e.g. 40 live classes"
          bnPlaceholder="যেমন: ৪০টি লাইভ ক্লাস"
          addLabel="Add feature"
        />
      </div>

      {/* ---------- Why this course ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Why This Course (cards)</h3>
        <WhyCardsEditor cards={values.whyCards} onChange={(cards) => set("whyCards", cards)} />
      </div>

      {/* ---------- Curriculum ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Curriculum (sections &amp; lessons)</h3>
        <CurriculumEditor
          sections={values.curriculumSections}
          onChange={(sections) => set("curriculumSections", sections)}
        />
      </div>

      {/* ---------- Media & misc ---------- */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Media, Visibility &amp; SEO</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Thumbnail</label>
            {values.thumbnail && (
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={values.thumbnail}
                  alt="Thumbnail preview"
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("thumbnail", "")}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            <label className="mb-2 inline-flex w-fit cursor-pointer items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadFile(e, "thumbnail", setUploadingThumbnail)}
                disabled={uploadingThumbnail}
              />
              <span className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                <Upload className="h-4 w-4" />
                {uploadingThumbnail ? "Uploading..." : "Upload thumbnail"}
              </span>
            </label>
            <input
              value={values.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              className={inputClass}
              placeholder="Or paste image URL"
            />
          </div>

          <div>
            <label className={labelClass}>Banner Image</label>
            {values.bannerImage && (
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={values.bannerImage}
                  alt="Banner preview"
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("bannerImage", "")}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            <label className="mb-2 inline-flex w-fit cursor-pointer items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadFile(e, "bannerImage", setUploadingBanner)}
                disabled={uploadingBanner}
              />
              <span className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                <Upload className="h-4 w-4" />
                {uploadingBanner ? "Uploading..." : "Upload banner"}
              </span>
            </label>
            <input
              value={values.bannerImage}
              onChange={(e) => set("bannerImage", e.target.value)}
              className={inputClass}
              placeholder="Or paste image URL"
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
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploadingThumbnail || uploadingBanner}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : courseId ? "Save Changes" : "Create Course"}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
