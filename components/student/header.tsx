"use client";

import { usePathname } from "next/navigation";
import { getStudentPageTitle } from "./sidebar";

export default function StudentHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h2 className="font-heading text-sm font-bold text-primary-dark lg:text-base">
        {getStudentPageTitle(pathname)}
      </h2>

      <div className="w-9 lg:hidden" />
    </header>
  );
}
