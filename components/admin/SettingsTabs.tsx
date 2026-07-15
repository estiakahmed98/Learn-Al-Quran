"use client";

import { useState } from "react";
import type { Content, SiteSetting } from "@prisma/client";
import SettingsForm from "@/components/admin/SettingsForm";
import ContentManager from "@/components/admin/ContentManager";

type Tab = "settings" | "content";

interface TeacherSummary {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  description: string | null;
  imageURL: string | null;
  isActive: boolean;
}

export default function SettingsTabs({
  settings,
  content,
  teachers,
}: {
  settings: SiteSetting | null;
  content: Content[];
  teachers: TeacherSummary[];
}) {
  const [tab, setTab] = useState<Tab>("settings");

  const tabs: { id: Tab; label: string }[] = [
    { id: "settings", label: "⚙️ Site Settings" },
    { id: "content", label: "🗂 Content" },
  ];

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "border-b-2 border-primary text-primary-dark"
                : "text-gray-500 hover:text-primary-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "settings" ? (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Manage site-wide content: header/footer identity, hero section, about us, payment details, location, and social links.
            </p>
            <SettingsForm initial={settings} />
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Manage Teachers, Reviews, FAQ, Blog posts, and Books shown across your site.
            </p>
            <ContentManager initialContent={content} initialTeachers={teachers} />
          </>
        )}
      </div>
    </div>
  );
}
