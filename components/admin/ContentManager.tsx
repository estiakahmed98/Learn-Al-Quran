"use client";

import { useState, ChangeEvent } from "react";
import type { Content, ContentType } from "@prisma/client";
import { Upload } from "lucide-react";

const TYPES: { value: ContentType; label: string }[] = [
  { value: "TEACHER", label: "Teachers" },
  { value: "REVIEW", label: "Reviews" },
  { value: "FAQ", label: "FAQ" },
  { value: "BOOK", label: "Books" }
];

const emptyForm = { title: "", subtitle: "", description: "", image: "" };
const emptyTeacherForm = {
  name: "",
  email: "",
  password: "",
  designation: "",
  description: "",
  imageURL: ""
};

interface TeacherUser {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  description: string | null;
  imageURL: string | null;
  isActive: boolean;
}

export default function ContentManager({
  initialContent,
  initialTeachers
}: {
  initialContent: Content[];
  initialTeachers: TeacherUser[];
}) {
  const [items, setItems] = useState(initialContent);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [activeTab, setActiveTab] = useState<ContentType>("TEACHER");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const filtered = items.filter((i) => i.type === activeTab);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setTeacherForm(emptyTeacherForm);
    setShowForm(true);
  }

  function openEditForm(item: Content) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
    });
    setShowForm(true);
  }

  function openTeacherEditForm(teacher: TeacherUser) {
    setEditingId(teacher.id);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      password: "",
      designation: teacher.designation || "",
      description: teacher.description || "",
      imageURL: teacher.imageURL || ""
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

      const res = await fetch("/api/upload/content", {
        method: "POST",
        body: fd
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      if (!data.url) throw new Error("Invalid upload response: url missing");

      if (activeTab === "TEACHER") {
        setTeacherForm((prev) => ({ ...prev, imageURL: data.url }));
      } else {
        setForm((prev) => ({ ...prev, image: data.url }));
      }
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

    if (activeTab === "TEACHER") {
      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      const { password, ...teacherFields } = teacherForm;
      const body = {
        ...teacherFields,
        role: "TEACHER",
        ...(password ? { password } : {})
      };

      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        const saved: TeacherUser = data;
        setTeachers((prev) =>
          editingId
            ? prev.map((teacher) => (teacher.id === editingId ? saved : teacher))
            : [saved, ...prev]
        );
        setTeacherForm(emptyTeacherForm);
        setEditingId(null);
        setShowForm(false);
      } else {
        alert(data?.message || "Failed to save teacher.");
      }
      setSaving(false);
      return;
    }

    if (editingId) {
      const res = await fetch(`/api/admin/content/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
      }
    } else {
      const slug = `${activeTab.toLowerCase()}-${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: activeTab, slug })
      });
      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        setForm(emptyForm);
        setShowForm(false);
      }
    }

    setSaving(false);
  }

  async function toggleTeacher(teacher: TeacherUser) {
    const res = await fetch(`/api/admin/users/${teacher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !teacher.isActive })
    });
    if (res.ok) {
      const updated = await res.json();
      setTeachers((prev) => prev.map((item) => (item.id === teacher.id ? updated : item)));
    }
  }

  async function removeTeacher(teacher: TeacherUser) {
    if (!confirm(`Delete teacher account "${teacher.name}" (${teacher.email})? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${teacher.id}`, { method: "DELETE" });
    if (res.ok) {
      setTeachers((prev) => prev.filter((item) => item.id !== teacher.id));
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Failed to delete teacher.");
    }
  }

  async function togglePublish(item: Content) {
    const res = await fetch(`/api/admin/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished })
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    }
  }

  async function remove(item: Content) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch(`/api/admin/content/${item.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  const activeLabel = TYPES.find((t) => t.value === activeTab)?.label;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setActiveTab(t.value);
              setShowForm(false);
              setEditingId(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeTab === t.value ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={openAddForm}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-gold-light"
        >
          + Add {activeTab === "TEACHER" ? "Teacher" : activeLabel}
        </button>
      </div>

      {activeTab === "TEACHER" ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="h-40 w-full shrink-0 bg-cream">
                {teacher.imageURL ? (
                  <img
                    src={teacher.imageURL}
                    alt={teacher.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <svg
                      className="h-10 w-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-xs text-gray-400">{teacher.email}</p>
                {teacher.designation && <p className="mt-1 text-xs font-medium text-gold">{teacher.designation}</p>}
                {teacher.description && (
                  <p className="mt-2 line-clamp-3 text-xs text-gray-500">{teacher.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => toggleTeacher(teacher)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      teacher.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {teacher.isActive ? "Active" : "Hidden"}
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openTeacherEditForm(teacher)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTeacher(teacher)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
              No teacher users yet. Click &quot;+ Add Teacher&quot; to create one.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
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
                <button
                  onClick={() => openEditForm(item)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => remove(item)} className="text-xs font-semibold text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
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
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-primary-dark">
                {editingId ? "Edit" : "Add"} {activeTab === "TEACHER" ? "Teacher" : activeLabel}
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
              {activeTab === "TEACHER" ? (
                <>
                  <input
                    required
                    placeholder="Teacher name"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <input
                    required={!editingId}
                    type="password"
                    minLength={6}
                    placeholder={editingId ? "New password (leave blank to keep current)" : "Password (minimum 6 characters)"}
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <input
                    placeholder="Designation (optional)"
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                  <textarea
                    placeholder="Teacher description"
                    value={teacherForm.description}
                    onChange={(e) => setTeacherForm({ ...teacherForm, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </>
              ) : (
                <>
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
                </>
              )}

              <div className="space-y-2">
                {(activeTab === "TEACHER" ? teacherForm.imageURL : form.image) && (
                  <div className="flex items-center gap-3">
                    <img
                      src={activeTab === "TEACHER" ? teacherForm.imageURL : form.image}
                      alt="Preview"
                      className="h-16 w-16 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "TEACHER") {
                          setTeacherForm((prev) => ({ ...prev, imageURL: "" }));
                        } else {
                          setForm((prev) => ({ ...prev, image: "" }));
                        }
                      }}
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
