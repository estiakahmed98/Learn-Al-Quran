import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import TeacherShell from "@/components/teacher/TeacherShell";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";

export const metadata = { robots: { index: false, follow: false } };

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/auth/login");
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-body">
        <AuthProvider>
          <TeacherShell teacherName={session.user.name || ""}>{children}</TeacherShell>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
