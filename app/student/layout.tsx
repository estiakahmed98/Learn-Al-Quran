import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import StudentShell from "@/components/student/StudentShell";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Middleware redirects unauthenticated /student requests to /auth/login.
  if (!session) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="flex min-h-screen flex-col font-body">
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    );
  }
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-body">
        <AuthProvider>
          <StudentShell>{children}</StudentShell>
        </AuthProvider>
      </body>
    </html>
  );
}
