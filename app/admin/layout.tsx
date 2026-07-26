import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import AdminShell from "@/components/admin/AdminShell";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Middleware redirects unauthenticated /admin requests to /auth/login.
  if (!session) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="flex min-h-screen flex-col font-body">
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-body">
        <AuthProvider>
          <AdminShell role={session.user.role} permissions={[]}>
            {children}
          </AdminShell>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
