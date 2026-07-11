"use client";

import { useState } from "react";
import type { Content, ContentType } from "@prisma/client";

const TYPES: { value: ContentType; label: string }[] = [
  { value: "TEACHER", label: "Teachers" },
  { value: "REVIEW", label: "Reviews" },
  { value: "FAQ", label: "FAQ" },
  { value: "BLOG", label: "Blog" },
  { value: "BOOK", label: "Books" }
];

export default function ContentManager({ initialContent }: { initialContent: Content[] }) {
  const [items, setItems] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<ContentType>("TEACHER");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((i) => i.type === activeTab);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = `${activeTab.toLowerCase()}-${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: activeTab, slug })
    });
    if (res.ok) {
      const created = await res.json();
      setItems((prev) => [...prev, created]);
      setForm({ title: "", subtitle: "", description: "", image: "" });
      setShowForm(false);
    }
    setSaving(false);
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

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setActiveTab(t.value);
              setShowForm(false);
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
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-light"
        >
          {showForm ? "Cancel" : `+ Add ${TYPES.find((t) => t.value === activeTab)?.label}`}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addItem} className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
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
          <input
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

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
              <button onClick={() => remove(item)} className="text-xs font-semibold text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
            No items yet. Click "+ Add" to create one.
          </p>
        )}
      </div>
    </div>
  );
}
