"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { AdminSection, UserRole } from "@/lib/permissions";
import SignOutButton from "./SignOutButton";

const navLinks: {
  href: string;
  label: string;
  title: string;
  section: AdminSection | null;
}[] = [
  {
    href: "/admin",
    label: "📊 Dashboard",
    title: "Dashboard",
    section: "DASHBOARD",
  },
  {
    href: "/admin/analytics",
    label: "📈 Analytics",
    title: "Analytics",
    section: "ANALYTICS",
  },
  {
    href: "/admin/users",
    label: "👥 Users Management",
    title: "Users Management",
    section: "USERS",
  },
  {
    href: "/admin/courses",
    label: "📚 Courses Management",
    title: "Courses",
    section: "COURSES",
  },
  {
    href: "/admin/students",
    label: "🎓 Student Management",
    title: "Student Management",
    section: "USERS",
  },
  {
    href: "/admin/class-reports",
    label: "🗓️ Class Reports",
    title: "Teacher Class Reports",
    section: "REPORTS",
  },
  {
    href: "/admin/payments",
    label: "💳 Payments Management",
    title: "Payments & Approvals",
    section: "PAYMENTS",
  },
  {
    href: "/admin/blog",
    label: "✍️ Blog",
    title: "Blog Management",
    section: "BLOG",
  },
  {
    href: "/admin/settings",
    label: "⚙️ Settings",
    title: "Site Settings",
    section: "SETTINGS",
  },
  {
    href: "/admin/newsletter",
    label: "📧 Newsletter",
    title: "Newsletter Management",
    section: "SETTINGS",
  },
  { href: "/", label: "🌐 View Site", title: "Admin Panel", section: null },
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
  visibleLinks,
  pendingPaymentsCount,
}: {
  onNavigate?: () => void;
  visibleLinks: typeof navLinks;
  pendingPaymentsCount: number;
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
            className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 font-medium hover:bg-cream ${
              isActive && link.href !== "/"
                ? "bg-cream text-primary-dark"
                : "text-gray-700"
            }`}
          >
            <span>{link.label}</span>
            {link.href === "/admin/payments" && pendingPaymentsCount > 0 && (
              <span
                className="inline-flex min-w-7 items-center justify-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700"
                aria-label={`${pendingPaymentsCount} pending payment approvals`}
              >
                <span aria-hidden="true">🔔</span>
                {pendingPaymentsCount}
              </span>
            )}
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
  pendingPaymentsCount: initialPendingPaymentsCount = 0,
}: {
  children: React.ReactNode;
  role?: UserRole;
  permissions?: AdminSection[];
  pendingPaymentsCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(
    initialPendingPaymentsCount,
  );
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

  useEffect(() => {
    function handlePendingPaymentsChange(event: Event) {
      const change = Number((event as CustomEvent<number>).detail ?? 0);
      setPendingPaymentsCount((current) => Math.max(0, current + change));
    }

    window.addEventListener(
      "admin:pending-payments-change",
      handlePendingPaymentsChange,
    );
    return () => {
      window.removeEventListener(
        "admin:pending-payments-change",
        handlePendingPaymentsChange,
      );
    };
  }, []);

  const visibleLinks =
    role === "TEACHER"
      ? navLinks.filter(
          (link) =>
            link.section === null || permissions?.includes(link.section),
        )
      : navLinks;

  return (
    <div className="flex h-screen flex-col bg-gray-50 lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 lg:flex">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Admin Panel
        </h2>
        <p className="mt-1 text-xs text-gray-400">Learn Al Quran Online BD</p>
        <SidebarNav
          visibleLinks={visibleLinks}
          pendingPaymentsCount={pendingPaymentsCount}
        />
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
            <SidebarNav
              onNavigate={() => setOpen(false)}
              visibleLinks={visibleLinks}
              pendingPaymentsCount={pendingPaymentsCount}
            />
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
