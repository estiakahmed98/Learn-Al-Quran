"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/admin/SignOutButton";

export const studentNavLinks = [
  { href: "/student/dashboard", label: "📊 Dashboard", title: "Dashboard" },
  { href: "/student/courses", label: "📚 My Courses", title: "My Courses" },
  { href: "/student/payments", label: "💳 Payments", title: "Payments" },
  { href: "/", label: "🌐 View Site", title: "Student Panel" }
];

export function getStudentPageTitle(pathname: string | null) {
  if (!pathname) return "Student Panel";
  const match = [...studentNavLinks]
    .filter((link) => link.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find((link) => pathname.startsWith(link.href));
  return match?.title ?? "Student Panel";
}

export function StudentSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1 text-sm">
      {studentNavLinks.map((link) => {
        const isActive = pathname?.startsWith(link.href) && link.href !== "/";
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2 font-medium hover:bg-cream ${
              isActive ? "bg-cream text-primary-dark" : "text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function StudentSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 lg:flex">
      <h2 className="font-heading text-lg font-bold text-primary-dark">Student Panel</h2>
      <p className="mt-1 text-xs text-gray-400">Learn Al Quran Online BD</p>
      <StudentSidebarNav />
      <div className="mt-auto pt-6">
        <SignOutButton />
      </div>
    </aside>
  );
}
