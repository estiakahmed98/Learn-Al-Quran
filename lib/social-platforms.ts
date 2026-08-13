export interface SocialPlatform {
  key: string;
  title: string;
  label: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { key: "facebook", title: "Facebook", label: "Fb" },
  { key: "youtube", title: "YouTube", label: "YT" },
  { key: "instagram", title: "Instagram", label: "Ig" },
  { key: "linkedin", title: "LinkedIn", label: "in" },
  { key: "whatsapp", title: "WhatsApp", label: "WA" },
  { key: "tiktok", title: "TikTok", label: "Tk" },
  { key: "reddit", title: "Reddit", label: "Reddit" },
  { key: "twitter", title: "X (Twitter)", label: "X" },
  { key: "telegram", title: "Telegram", label: "Tg" },
  { key: "pinterest", title: "Pinterest", label: "Pi" },
  { key: "snapchat", title: "Snapchat", label: "Sc" },
  { key: "other", title: "Other", label: "Link" }
];

export interface SocialLink {
  platform: string;
  url: string;
}

export function socialPlatformInfo(platformKey: string): SocialPlatform {
  return (
    SOCIAL_PLATFORMS.find((platform) => platform.key === platformKey) ||
    SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1]
  );
}

export function parseSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is SocialLink =>
      !!item && typeof item === "object" && typeof (item as SocialLink).platform === "string" && typeof (item as SocialLink).url === "string"
  );
}
