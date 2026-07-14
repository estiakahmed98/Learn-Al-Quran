export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string, locale = "en") {
  return new Date(date).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function waLink(number: string, message = "") {
  const clean = number.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${clean}${message ? `?text=${text}` : ""}`;
}

export function generateSlug(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
