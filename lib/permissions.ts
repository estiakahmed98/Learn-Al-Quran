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
  "CONTENT"
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

export const SECTION_PATHS: { section: AdminSection; path: string }[] = [
  { section: "DASHBOARD", path: "/admin" },
  { section: "ANALYTICS", path: "/admin/analytics" },
  { section: "BLOG", path: "/admin/blog" },
  { section: "COURSES", path: "/admin/courses" },
  { section: "USERS", path: "/admin/trials" },
  { section: "USERS", path: "/admin/users" },
  { section: "PAYMENTS", path: "/admin/payments" },
  { section: "CONTENT", path: "/admin/content" }
];

export function sectionForPath(pathname: string): AdminSection | null {
  const match = [...SECTION_PATHS]
    .sort((a, b) => b.path.length - a.path.length)
    .find((entry) => (entry.path === "/admin" ? pathname === "/admin" : pathname.startsWith(entry.path)));
  return match?.section ?? null;
}
