import { Toaster } from "sonner";
import AuthProvider from "@/components/admin/AuthProvider";
import AdminShell from "@/components/admin/AdminShell";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
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
  const auth = await getAuthSession();
  const session = auth?.session;
  const dashboardSummary = auth
    ? await api.dashboard.summary(auth.token).catch(() => null)
    : null;
  const paymentStatuses = dashboardSummary?.enrollments?.byPaymentStatus ?? {};
  const pendingPaymentsCount =
    Number(paymentStatuses.PENDING ?? 0) + Number(paymentStatuses.PAID ?? 0);

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
          <AdminShell
            role={session.user.role}
            permissions={[]}
            pendingPaymentsCount={pendingPaymentsCount}
          >
            {children}
          </AdminShell>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
