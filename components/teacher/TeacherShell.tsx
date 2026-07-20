"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";

const navLinks = [
  { href: "/teacher", label: "📊 My Courses", title: "My Courses" },
  { href: "/teacher/classes", label: "📝 Submit Class Report", title: "Submit Class Report" },
  { href: "/teacher/reports", label: "📄 My Reports", title: "My Reports" },
  { href: "/", label: "🌐 View Site", title: "Teacher Panel" }
];

function getPageTitle(pathname: string | null) {
  if (!pathname) return "Teacher Panel";
  const match = [...navLinks]
    .filter((link) => link.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find((link) => (link.href === "/teacher" ? pathname === "/teacher" : pathname.startsWith(link.href)));
  return match?.title ?? "Teacher Panel";
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1 text-sm">
      {navLinks.map((link) => {
        const isActive = link.href === "/teacher" ? pathname === "/teacher" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2 font-medium hover:bg-cream ${
              isActive && link.href !== "/" ? "bg-cream text-primary-dark" : "text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function TeacherShell({
  children,
  teacherName
}: {
  children: React.ReactNode;
  teacherName: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex h-screen flex-col bg-gray-50 lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 lg:flex">
        <h2 className="font-heading text-lg font-bold text-primary-dark">Teacher Panel</h2>
        <p className="mt-1 text-xs text-gray-400">{teacherName}</p>
        <SidebarNav />
        <div className="mt-auto pt-6">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-primary-dark">Teacher Panel</h2>
                <p className="mt-1 text-xs text-gray-400">{teacherName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
              >
                ✕
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <div className="mt-auto pt-6">
              <SignOutButton />
            </div>
          </aside>
        </div>
      )}

      {/* Main column: header + scrollable content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h2 className="font-heading text-sm font-bold text-primary-dark lg:text-base">{getPageTitle(pathname)}</h2>

          <div className="w-9 lg:hidden" />
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
