import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import StudentShell from "@/components/student/StudentShell";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Middleware redirects unauthenticated /student requests to /auth/login.
  if (!session) return <AuthProvider>{children}</AuthProvider>;
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <AuthProvider>
      <StudentShell>{children}</StudentShell>
    </AuthProvider>
  );
}
