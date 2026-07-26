"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS, parseSocialLinks, type SocialLink } from "@/lib/social-platforms";
import { updateSiteSettings, uploadSettingsImage } from "@/app/admin/settings/actions";

type SiteSetting = Record<string, unknown>;

type FormState = Record<
  | "siteName" | "logo" | "favicon"
  | "phone" | "whatsapp" | "email" | "address"
  | "bkashNumber" | "nagadNumber" | "rocketNumber" | "bankAccount" | "westernUnionInfo"
  | "googleMapUrl" | "ga4Id"
  | "copyrightText" | "privacyPolicy" | "terms" | "returnPolicy"
  | "heroBadgeEn" | "heroBadgeBn" | "heroTitleEn" | "heroTitleBn"
  | "heroSubtitleEn" | "heroSubtitleBn" | "heroImage"
  | "aboutTitleEn" | "aboutTitleBn" | "aboutDescriptionEn" | "aboutDescriptionBn" | "aboutImage",
  string
>;

function toFormState(settings: SiteSetting | null): FormState {
  const fields: (keyof FormState)[] = [
    "siteName", "logo", "favicon",
    "phone", "whatsapp", "email", "address",
    "bkashNumber", "nagadNumber", "rocketNumber", "bankAccount", "westernUnionInfo",
    "googleMapUrl", "ga4Id",
    "copyrightText", "privacyPolicy", "terms", "returnPolicy",
    "heroBadgeEn", "heroBadgeBn", "heroTitleEn", "heroTitleBn",
    "heroSubtitleEn", "heroSubtitleBn", "heroImage",
    "aboutTitleEn", "aboutTitleBn", "aboutDescriptionEn", "aboutDescriptionBn", "aboutImage"
  ];
  const state = {} as FormState;
  for (const field of fields) {
    state[field] = (settings?.[field] as string) || "";
  }
  return state;
}

const SECTIONS: {
  title: string;
  icon: string;
  fields: { key: keyof FormState; label: string; type?: "text" | "textarea" | "image" }[];
}[] = [
  {
    title: "Site Identity (Header & Footer)",
    icon: "🏷️",
    fields: [
      { key: "siteName", label: "Site Name / Title" },
      { key: "logo", label: "Logo", type: "image" },
      { key: "favicon", label: "Favicon", type: "image" }
    ]
  },
  {
    title: "Hero Section",
    icon: "🌟",
    fields: [
      { key: "heroBadgeEn", label: "Badge (English)" },
      { key: "heroBadgeBn", label: "Badge (Bangla)" },
      { key: "heroTitleEn", label: "Title (English)", type: "textarea" },
      { key: "heroTitleBn", label: "Title (Bangla)", type: "textarea" },
      { key: "heroSubtitleEn", label: "Description (English)", type: "textarea" },
      { key: "heroSubtitleBn", label: "Description (Bangla)", type: "textarea" },
      { key: "heroImage", label: "Hero Image", type: "image" }
    ]
  },
  {
    title: "About Us Section",
    icon: "📖",
    fields: [
      { key: "aboutTitleEn", label: "Title (English)" },
      { key: "aboutTitleBn", label: "Title (Bangla)" },
      { key: "aboutDescriptionEn", label: "Description (English)", type: "textarea" },
      { key: "aboutDescriptionBn", label: "Description (Bangla)", type: "textarea" },
      { key: "aboutImage", label: "About Image", type: "image" }
    ]
  },
  {
    title: "Contact Info",
    icon: "📞",
    fields: [
      { key: "phone", label: "Phone" },
      { key: "whatsapp", label: "WhatsApp Number" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address", type: "textarea" }
    ]
  },
  {
    title: "Payment Details (Lead Form & Enroll)",
    icon: "💳",
    fields: [
      { key: "bkashNumber", label: "Bkash Number" },
      { key: "nagadNumber", label: "Nagad Number" },
      { key: "rocketNumber", label: "Rocket Number" },
      { key: "bankAccount", label: "Bank Account Details", type: "textarea" },
      { key: "westernUnionInfo", label: "Western Union Info", type: "textarea" }
    ]
  },
  {
    title: "Location (Google Map)",
    icon: "📍",
    fields: [{ key: "googleMapUrl", label: "Google Map Embed URL", type: "textarea" }]
  },
  {
    title: "Footer & Legal",
    icon: "⚖️",
    fields: [
      { key: "copyrightText", label: "Copyright Text" },
      { key: "privacyPolicy", label: "Privacy Policy", type: "textarea" },
      { key: "terms", label: "Terms & Conditions", type: "textarea" },
      { key: "returnPolicy", label: "Return Policy", type: "textarea" }
    ]
  },
  {
    title: "Analytics",
    icon: "📈",
    fields: [{ key: "ga4Id", label: "Google Analytics (GA4) ID" }]
  }
];

const SOCIAL_SECTION_TITLE = "Social Media";

export default function SettingsForm({
  initial,
  only
}: {
  initial: SiteSetting | null;
  only?: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(parseSocialLinks(initial?.socialLinks));
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { platform: SOCIAL_PLATFORMS[0].key, url: "" }]);
  }

  function updateSocialLink(index: number, patch: Partial<SocialLink>) {
    setSocialLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImageChange(key: keyof FormState, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(key);
      const fd = new FormData();
      fd.append("file", file);
      const collection = key === "heroImage" ? "hero" : key === "logo" || key === "favicon" ? "organization" : "general";
      fd.append("variant", key === "heroImage" ? "banner" : key === "logo" || key === "favicon" ? "logo" : "image");
      fd.append("owner_id", "main");
      const data = await uploadSettingsImage(fd, collection);
      if (!data.url) throw new Error("Invalid upload response: url missing");
      update(key, data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateSiteSettings({
        ...form,
        socialLinks: socialLinks.filter((link) => link.url.trim())
      });
      setMessage({ type: "success", text: "Settings saved successfully." });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {(!only || only.includes(SOCIAL_SECTION_TITLE)) && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary-dark">
            <span>🌐</span>
            {SOCIAL_SECTION_TITLE}
          </h3>
          <div className="mt-4 space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <select
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, { platform: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.key} value={platform.key}>
                      {platform.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  aria-label="Remove social link"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSocialLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-semibold text-primary-dark transition hover:border-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" />
              Add Social Link
            </button>
          </div>
        </div>
      )}

      {SECTIONS.filter((section) => !only || only.includes(section.title)).map((section) => (
        <div key={section.title} className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary-dark">
            <span>{section.icon}</span>
            {section.title}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="text-sm font-medium text-gray-700">{field.label}</label>

                {field.type === "image" ? (
                  <div className="mt-1.5 flex items-center gap-3">
                    {form[field.key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form[field.key]}
                        alt={field.label}
                        className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleImageChange(field.key, e)}
                        disabled={uploadingField === field.key}
                        className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-dark hover:file:bg-primary/20"
                      />
                      {uploadingField === field.key && (
                        <p className="mt-1 text-xs text-gray-400">Uploading...</p>
                      )}
                    </div>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 flex justify-end border-t border-gray-200 bg-gray-50/95 py-3 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
