import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Middleware redirects unauthenticated /admin requests to /auth/login.
  if (!session) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  const role = session.user.role;
  const permissions = role === "TEACHER" ? session.user.permissions : [];

  return (
    <AuthProvider>
      <AdminShell role={role} permissions={permissions}>
        {children}
      </AdminShell>
    </AuthProvider>
  );
}
