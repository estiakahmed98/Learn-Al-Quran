import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/admin/AuthProvider";
import SignOutButton from "@/components/admin/SignOutButton";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Middleware redirects unauthenticated /admin requests to /auth/login.
  if (!session) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-6 lg:flex">
          <h2 className="font-heading text-lg font-bold text-primary-dark">Admin Panel</h2>
          <p className="mt-1 text-xs text-gray-400">Learn Al Quran Online BD</p>

          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-cream">
              📊 Dashboard
            </Link>
            <Link href="/admin/courses" className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-cream">
              📚 Courses
            </Link>
            <Link href="/admin/enrollments" className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-cream">
              📝 Enrollments
            </Link>
            <Link href="/admin/content" className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-cream">
              🗂 Content
            </Link>
            <Link href="/" className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-cream">
              🌐 View Site
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <SignOutButton />
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </AuthProvider>
  );
}
