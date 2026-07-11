export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
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
