"use client";

import { useState, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { createContentItem, updateContentItem, deleteContentItem, uploadSettingsImage } from "@/app/admin/settings/actions";

type ContentType = "PAGE" | "HOME_SECTION" | "TEACHER" | "REVIEW" | "FAQ" | "BLOG" | "BOOK";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  isPublished: boolean;
  sortOrder: number;
}

const LABELS: Record<ContentType, string> = {
  PAGE: "Page",
  HOME_SECTION: "Home Section",
  TEACHER: "Teacher",
  REVIEW: "Review",
  FAQ: "FAQ",
  BLOG: "Blog",
  BOOK: "Book"
};

const emptyForm = { title: "", subtitle: "", description: "", image: "" };

export default function ContentManager({
  type,
  initialContent
}: {
  type: ContentType;
  initialContent: ContentItem[];
}) {
  const [items, setItems] = useState(initialContent);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const label = LABELS[type];

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(item: ContentItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || ""
    });
    setShowForm(true);
  }

  async function handleImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append("file", file);

      const data = await uploadSettingsImage(fd);
      if (!data.url) throw new Error("Invalid upload response: url missing");

      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const updated = await updateContentItem(editingId, form);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
      } else {
        const slug = `${type.toLowerCase()}-${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
        const created = await createContentItem({ ...form, type, slug });
        setItems((prev) => [...prev, created]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } catch {
      // no-op: keep the form open so the admin can retry
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: ContentItem) {
    try {
      const updated = await updateContentItem(item.id, { isPublished: !item.isPublished });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch {
      // no-op
    }
  }

  async function remove(item: ContentItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteContentItem(item.id, item.type);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      // no-op
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={openAddForm}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gold-light"
        >
          + Add {label}
        </button>
      </div>

      {type === "BOOK" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="h-48 w-full shrink-0 bg-cream">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s4.332.477 5.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-medium text-gray-800">{item.title}</p>
                {item.subtitle && <p className="mt-0.5 text-xs text-gray-400">{item.subtitle}</p>}
                {item.description && <p className="mt-2 line-clamp-3 text-xs text-gray-500">{item.description}</p>}
                <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => togglePublish(item)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Hidden"}
                  </button>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEditForm(item)} className="text-xs font-semibold text-primary hover:underline">
                      Edit
                    </button>
                    <button onClick={() => remove(item)} className="text-xs font-semibold text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
              No books yet. Click &quot;+ Add Book&quot; to create one.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublish(item)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.isPublished ? "Published" : "Hidden"}
                </button>
                <button onClick={() => openEditForm(item)} className="text-xs font-semibold text-primary hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(item)} className="text-xs font-semibold text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
              No items yet. Click &quot;+ Add&quot; to create one.
            </p>
          )}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
          onClick={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-primary-dark">
                {editingId ? "Edit" : "Add"} {label}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveItem} className="space-y-3">
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
              <input
                placeholder="Subtitle (optional)"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
              <textarea
                placeholder="Description / Content"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />

              <div className="space-y-2">
                {form.image && (
                  <div className="flex items-center gap-3">
                    <img src={form.image} alt="Preview" className="h-16 w-16 rounded-md border object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                )}

                <label className="inline-flex w-fit cursor-pointer items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? "Uploading..." : "Upload image"}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
