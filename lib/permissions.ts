import type { AdminSection, UserRole } from "@prisma/client";

// Sections a teacher can access by default when no explicit permissions are set yet.
export const DEFAULT_TEACHER_SECTIONS: AdminSection[] = [
  "DASHBOARD",
  "ANALYTICS",
  "BLOG",
  "COURSES",
  "PAYMENTS",
  "CONTENT"
];

export const ALL_ADMIN_SECTIONS: AdminSection[] = [
  "DASHBOARD",
  "ANALYTICS",
  "BLOG",
  "COURSES",
  "USERS",
  "PAYMENTS",
  "CONTENT",
  "SETTINGS"
];

export function effectivePermissions(
  role: UserRole,
  permissions: AdminSection[] | null | undefined
): AdminSection[] {
  if (role === "ADMIN") return ALL_ADMIN_SECTIONS;
  if (role === "TEACHER") return permissions && permissions.length > 0 ? permissions : DEFAULT_TEACHER_SECTIONS;
  return [];
}

export function canAccessSection(
  role: UserRole,
  permissions: AdminSection[] | null | undefined,
  section: AdminSection
): boolean {
  if (role === "ADMIN") return true;
  if (role !== "TEACHER") return false;
  return effectivePermissions(role, permissions).includes(section);
}

// A path can be satisfied by any one of several sections (e.g. /admin/settings
// hosts both the Content tab and the Settings tab, so either permission unlocks it).
export const SECTION_PATHS: { sections: AdminSection[]; path: string }[] = [
  { sections: ["DASHBOARD"], path: "/admin" },
  { sections: ["ANALYTICS"], path: "/admin/analytics" },
  { sections: ["BLOG"], path: "/admin/blog" },
  { sections: ["COURSES"], path: "/admin/courses" },
  { sections: ["USERS"], path: "/admin/trials" },
  { sections: ["USERS"], path: "/admin/users" },
  { sections: ["PAYMENTS"], path: "/admin/payments" },
  { sections: ["CONTENT", "SETTINGS"], path: "/admin/settings" }
];

export function sectionsForPath(pathname: string): AdminSection[] | null {
  const match = [...SECTION_PATHS]
    .sort((a, b) => b.path.length - a.path.length)
    .find((entry) => (entry.path === "/admin" ? pathname === "/admin" : pathname.startsWith(entry.path)));
  return match?.sections ?? null;
}

export function canAccessAnySection(
  role: UserRole,
  permissions: AdminSection[] | null | undefined,
  sections: AdminSection[]
): boolean {
  return sections.some((section) => canAccessSection(role, permissions, section));
}
