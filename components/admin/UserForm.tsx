"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  imageURL: string;
  role: "ADMIN" | "STUDENT";
  isActive: boolean;
  password: string;
}

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  imageURL: "",
  role: "STUDENT",
  isActive: true,
  password: ""
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

  function set<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
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
      imageURL: values.imageURL.trim(),
      role: values.role,
      isActive: values.isActive
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

        <div>
          <label className={labelClass}>Profile Image URL</label>
          <input
            value={values.imageURL}
            onChange={(e) => set("imageURL", e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select
            value={values.role}
            onChange={(e) => set("role", e.target.value as "ADMIN" | "STUDENT")}
            className={inputClass}
          >
            <option value="STUDENT">Student</option>
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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : userId ? "Save Changes" : "Create User"}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
