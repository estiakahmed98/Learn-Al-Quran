import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessSection, type AdminSection } from "@/lib/permissions";

/** For API routes: returns the session if it belongs to an admin, or a teacher with access to `section`. */
export async function requireSectionAccess(section: AdminSection) {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const role = session.user.role;
  if (!canAccessSection(role, session.user.permissions, section)) return null;
  return session;
}
