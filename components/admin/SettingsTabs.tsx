"use client";

import { useState } from "react";
import SettingsForm from "@/components/admin/SettingsForm";
import ContentManager, { type ContentItem } from "@/components/admin/ContentManager";

type SiteSetting = Record<string, unknown>;

type TabId =
  | "identity"
  | "hero"
  | "about"
  | "contact"
  | "payment"
  | "location"
  | "social"
  | "footer"
  | "analytics"
  | "reviews"
  | "faq"
  | "books";

const TABS: {
  id: TabId;
  label: string;
  icon: string;
  colorClasses: { active: string; inactive: string };
}[] = [
  {
    id: "identity",
    label: "Site Identity",
    icon: "🏷️",
    colorClasses: { active: "bg-indigo-600 text-white shadow-indigo-200", inactive: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" }
  },
  {
    id: "hero",
    label: "Hero Section",
    icon: "🌟",
    colorClasses: { active: "bg-amber-500 text-white shadow-amber-200", inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" }
  },
  {
    id: "about",
    label: "About Us Section",
    icon: "📖",
    colorClasses: { active: "bg-emerald-600 text-white shadow-emerald-200", inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" }
  },
  {
    id: "contact",
    label: "Contact Info",
    icon: "📞",
    colorClasses: { active: "bg-sky-600 text-white shadow-sky-200", inactive: "bg-sky-50 text-sky-700 hover:bg-sky-100" }
  },
  {
    id: "payment",
    label: "Payment Details",
    icon: "💳",
    colorClasses: { active: "bg-rose-600 text-white shadow-rose-200", inactive: "bg-rose-50 text-rose-700 hover:bg-rose-100" }
  },
  {
    id: "location",
    label: "Location",
    icon: "📍",
    colorClasses: { active: "bg-teal-600 text-white shadow-teal-200", inactive: "bg-teal-50 text-teal-700 hover:bg-teal-100" }
  },
  {
    id: "social",
    label: "Social Media",
    icon: "🌐",
    colorClasses: { active: "bg-violet-600 text-white shadow-violet-200", inactive: "bg-violet-50 text-violet-700 hover:bg-violet-100" }
  },
  {
    id: "footer",
    label: "Footer & Legal",
    icon: "⚖️",
    colorClasses: { active: "bg-slate-700 text-white shadow-slate-200", inactive: "bg-slate-100 text-slate-700 hover:bg-slate-200" }
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "📈",
    colorClasses: { active: "bg-cyan-600 text-white shadow-cyan-200", inactive: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100" }
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "⭐",
    colorClasses: { active: "bg-fuchsia-600 text-white shadow-fuchsia-200", inactive: "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100" }
  },
  {
    id: "faq",
    label: "FAQ",
    icon: "❓",
    colorClasses: { active: "bg-orange-500 text-white shadow-orange-200", inactive: "bg-orange-50 text-orange-700 hover:bg-orange-100" }
  },
  {
    id: "books",
    label: "Books",
    icon: "📚",
    colorClasses: { active: "bg-lime-600 text-white shadow-lime-200", inactive: "bg-lime-50 text-lime-700 hover:bg-lime-100" }
  }
];

const SECTION_TITLES: Record<Exclude<TabId, "reviews" | "faq" | "books">, string> = {
  identity: "Site Identity (Header & Footer)",
  hero: "Hero Section",
  about: "About Us Section",
  contact: "Contact Info",
  payment: "Payment Details (Lead Form & Enroll)",
  location: "Location (Google Map)",
  social: "Social Media",
  footer: "Footer & Legal",
  analytics: "Analytics"
};

export default function SettingsTabs({
  settings,
  content
}: {
  settings: SiteSetting | null;
  content: ContentItem[];
}) {
  const [tab, setTab] = useState<TabId>("identity");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
              tab === t.id ? t.colorClasses.active : t.colorClasses.inactive
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "reviews" && (
          <ContentManager type="REVIEW" initialContent={content.filter((c) => c.type === "REVIEW")} />
        )}
        {tab === "faq" && <ContentManager type="FAQ" initialContent={content.filter((c) => c.type === "FAQ")} />}
        {tab === "books" && <ContentManager type="BOOK" initialContent={content.filter((c) => c.type === "BOOK")} />}
        {tab !== "reviews" && tab !== "faq" && tab !== "books" && (
          <SettingsForm initial={settings} only={[SECTION_TITLES[tab]]} />
        )}
      </div>
    </div>
  );
}
