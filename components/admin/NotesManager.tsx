"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface NoteRow {
  id: string;
  title: string;
  content: string | null;
  fileUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

const emptyForm = { title: "", content: "", fileUrl: "" };

export default function NotesManager({
  courseId,
  initialNotes
}: {
  courseId: string;
  initialNotes: NoteRow[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, ...form })
    });
    if (res.ok) {
      const created = await res.json();
      setNotes((prev) => [created, ...prev]);
      setForm(emptyForm);
    }
    setSaving(false);
  }

  async function togglePublish(note: NoteRow) {
    const res = await fetch(`/api/admin/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !note.isPublished })
    });
    if (res.ok) {
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this note?")) return;
    const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE" });
    if (res.ok) setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div>
      <div className="space-y-3">
        {notes.map((n) => (
          <div key={n.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-800">{n.title}</p>
                {n.content && <p className="mt-1 text-sm text-gray-500">{n.content}</p>}
                {n.fileUrl && (
                  <a
                    href={n.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    📎 {n.fileUrl}
                  </a>
                )}
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublish(n)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    n.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {n.isPublished ? "Published" : "Hidden"}
                </button>
                <button
                  onClick={() => remove(n.id)}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-gray-400">No notes added yet.</p>}
      </div>

      <form onSubmit={addNote} className="mt-4 space-y-2 rounded-xl border border-gray-200 p-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title *"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Note content (optional)"
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          value={form.fileUrl}
          onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
          placeholder="Attachment URL (optional)"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving || !form.title.trim()}
          className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}
