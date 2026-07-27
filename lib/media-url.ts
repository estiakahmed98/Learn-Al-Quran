const MEDIA_PLACEHOLDER = "media-placeholder.svg";

/**
 * Laravel serializes uploaded media as absolute URLs. Re-route managed
 * `/storage/*` files through the Next.js origin so they also work when the
 * site is opened from another device or the API uses an internal hostname.
 */
export function publicMediaUrl(
  value: string | null | undefined,
  fallback = "",
): string {
  if (!value || value.includes(MEDIA_PLACEHOLDER)) return fallback;
  if (value.startsWith("/storage/")) return value;

  try {
    const url = new URL(value);
    if (url.pathname.startsWith("/storage/")) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    // Relative/local public asset. Leave it unchanged.
  }

  return value;
}
