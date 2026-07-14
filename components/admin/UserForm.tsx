"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import type { AdminSection } from "@prisma/client";
import { ALL_ADMIN_SECTIONS, DEFAULT_TEACHER_SECTIONS } from "@/lib/permissions";

export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  description: string;
  designation: string;
  imageURL: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isActive: boolean;
  password: string;
  permissions: AdminSection[];
}

const SECTION_LABELS: Record<AdminSection, string> = {
  DASHBOARD: "Dashboard",
  ANALYTICS: "Analytics",
  BLOG: "Blog",
  COURSES: "Courses",
  USERS: "Users Management",
  PAYMENTS: "Payments",
  CONTENT: "Content"
};

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  description: "",
  designation: "",
  imageURL: "",
  role: "STUDENT",
  isActive: true,
  password: "",
  permissions: []
};

export default function UserForm({
  userId,
  initial,
  onSaved
}: {
  userId?: string;
  initial?: Partial<UserFormValues>;
  onSaved?: (user: any) => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<UserFormValues>({ ...emptyValues, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  function set<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload/users", {
        method: "POST",
        body: fd
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      if (!data.url) throw new Error("Invalid upload response: url missing");

      set("imageURL", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!userId && values.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);

    const payload: Record<string, unknown> = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      whatsapp: values.whatsapp.trim(),
      address: values.address.trim(),
      description: values.description.trim(),
      designation: values.designation.trim(),
      imageURL: values.imageURL.trim(),
      role: values.role,
      isActive: values.isActive,
      permissions: values.role === "TEACHER" ? values.permissions : []
    };
    if (values.password) payload.password = values.password;

    const res = await fetch(userId ? `/api/admin/users/${userId}` : "/api/admin/users", {
      method: userId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to save user.");
      return;
    }

    const user = await res.json();
    setSaved(true);
    set("password", "");
    onSaved?.(user);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none";
  const labelClass = "mb-1 block text-xs font-semibold text-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
            placeholder="e.g. Abdullah Rahman"
          />
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
            placeholder="+8801..."
          />
        </div>

        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            value={values.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className={inputClass}
            placeholder="+8801..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <textarea
            rows={2}
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
            className={inputClass}
          />
        </div>

        {values.role === "TEACHER" && (
          <div>
            <label className={labelClass}>Designation</label>
            <input
              value={values.designation}
              onChange={(e) => set("designation", e.target.value)}
              className={inputClass}
              placeholder="e.g. Hifz & Tajweed Specialist"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
            placeholder="Short bio or notes about this user..."
          />
        </div>

        <div>
          <label className={labelClass}>Profile Image</label>
          {values.imageURL && (
            <div className="mb-2 flex items-center gap-3">
              <img
                src={values.imageURL}
                alt="Profile preview"
                className="h-16 w-16 rounded-full border object-cover"
              />
              <button
                type="button"
                onClick={() => set("imageURL", "")}
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
              onChange={uploadImage}
              disabled={uploadingImage}
            />
            <span className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
              <Upload className="h-4 w-4" />
              {uploadingImage ? "Uploading..." : "Upload image"}
            </span>
          </label>
          <input
            value={values.imageURL}
            onChange={(e) => set("imageURL", e.target.value)}
            className={inputClass}
            placeholder="Or paste image URL"
          />
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select
            value={values.role}
            onChange={(e) => {
              const role = e.target.value as "ADMIN" | "TEACHER" | "STUDENT";
              set("role", role);
              if (role === "TEACHER" && values.permissions.length === 0) {
                set("permissions", DEFAULT_TEACHER_SECTIONS);
              }
            }}
            className={inputClass}
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            {userId ? "New Password (leave blank to keep current)" : "Password *"}
          </label>
          <input
            type="password"
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            className={inputClass}
            placeholder={userId ? "••••••" : "Minimum 6 characters"}
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4"
            />
            Active (inactive users cannot log in)
          </label>
        </div>
      </div>

      {values.role === "TEACHER" && (
        <div>
          <label className={labelClass}>Admin Panel Access</label>
          <p className="mb-2 text-xs text-gray-400">
            Choose which admin sections this teacher can access.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ALL_ADMIN_SECTIONS.map((section) => (
              <label key={section} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={values.permissions.includes(section)}
                  onChange={(e) => {
                    set(
                      "permissions",
                      e.target.checked
                        ? [...values.permissions, section]
                        : values.permissions.filter((s) => s !== section)
                    );
                  }}
                />
                {SECTION_LABELS[section]}
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : userId ? "Save Changes" : "Create User"}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
