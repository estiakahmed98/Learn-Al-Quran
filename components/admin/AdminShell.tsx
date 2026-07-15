"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { AdminSection, UserRole } from "@prisma/client";
import SignOutButton from "./SignOutButton";

const navLinks: { href: string; label: string; title: string; section: AdminSection | null }[] = [
  { href: "/admin", label: "📊 Dashboard", title: "Dashboard", section: "DASHBOARD" },
  { href: "/admin/analytics", label: "📈 Analytics", title: "Analytics", section: "ANALYTICS" },
  { href: "/admin/blog", label: "✍️ Blog", title: "Blog Management", section: "BLOG" },
  { href: "/admin/courses", label: "📚 Courses", title: "Courses", section: "COURSES" },
  {
    href: "/admin/trials",
    label: "Free Trial Students",
    title: "Free Trial Management",
    section: "USERS"
  },
  {
    href: "/admin/users",
    label: "👥 Users Management",
    title: "Users Management",
    section: "USERS"
  },
  {
    href: "/admin/payments",
    label: "💳 Payments",
    title: "Payments & Approvals",
    section: "PAYMENTS"
  },
  { href: "/admin/content", label: "🗂 Content", title: "Content", section: "CONTENT" },
  { href: "/admin/settings", label: "⚙️ Settings", title: "Site Settings", section: "SETTINGS" },
  { href: "/", label: "🌐 View Site", title: "Admin Panel", section: null }
];

function getPageTitle(pathname: string | null) {
  if (!pathname) return "Admin Panel";
  const match = [...navLinks]
    .filter((link) => link.href !== "/")
    .sort((a, b) => b.href.length - a.href.length)
    .find((link) =>
      link.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(link.href),
    );
  return match?.title ?? "Admin Panel";
}

function SidebarNav({
  onNavigate,
  visibleLinks
}: {
  onNavigate?: () => void;
  visibleLinks: typeof navLinks;
}) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1 text-sm">
      {visibleLinks.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2 font-medium hover:bg-cream ${
              isActive && link.href !== "/"
                ? "bg-cream text-primary-dark"
                : "text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({
  children,
  role,
  permissions,
}: {
  children: React.ReactNode;
  role?: UserRole;
  permissions?: AdminSection[];
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

  const visibleLinks =
    role === "TEACHER"
      ? navLinks.filter((link) => link.section === null || permissions?.includes(link.section))
      : navLinks;

  return (
    <div className="flex h-screen flex-col bg-gray-50 lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 lg:flex">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Admin Panel
        </h2>
        <p className="mt-1 text-xs text-gray-400">Learn Al Quran Online BD</p>
        <SidebarNav visibleLinks={visibleLinks} />
        <div className="mt-auto pt-6">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-primary-dark">
                  Admin Panel
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Learn Al Quran Online BD
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
              >
                ✕
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} visibleLinks={visibleLinks} />
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h2 className="font-heading text-sm font-bold text-primary-dark lg:text-base">
            {getPageTitle(pathname)}
          </h2>

          <div className="w-9 lg:hidden" />
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
