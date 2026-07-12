"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/admin/SignOutButton";
import StudentSidebar, { StudentSidebarNav } from "./sidebar";
import StudentHeader from "./header";

export default function StudentShell({
  children,
}: {
  children: React.ReactNode;
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
      <StudentSidebar />

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
                  Student Panel
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
            <StudentSidebarNav onNavigate={() => setOpen(false)} />
            <div className="mt-auto pt-6">
              <SignOutButton />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <StudentHeader onMenuClick={() => setOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
