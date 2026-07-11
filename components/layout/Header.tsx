"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

const courseLinks = [
  { title: "Smart Maktab Learning", slug: "smart-maktab-learning" },
  { title: "Tajweed Master Course", slug: "tajweed-master-course" },
  { title: "Complete Nazera Quran", slug: "complete-nazera-quran" },
  { title: "Complete Hifzul Quran", slug: "complete-hifzul-quran" },
  { title: "Adult Quran Learning", slug: "adult-quran-learning" },
  { title: "English Speaking", slug: "english-speaking" }
];

export default function Header({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl text-white">
            🕌
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-base font-bold uppercase tracking-wide text-primary-dark lg:text-lg">
              Learn Al Quran
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Online BD
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCoursesOpen(true)}
            onMouseLeave={() => setCoursesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary">
              Courses <span className="text-xs">▾</span>
            </button>
            {coursesOpen && (
              <div className="absolute left-0 top-full w-64 rounded-lg border border-gold/20 bg-white py-2 shadow-xl">
                {courseLinks.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-cream hover:text-primary"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/#courses"
            className="flex items-center gap-2 rounded-full border-2 border-gold bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow transition hover:bg-primary-dark"
          >
            <span className="text-gold-light">★</span> Master Classes
          </Link>

          <Link href="/books" className="text-sm font-medium text-gray-700 hover:text-primary">
            📖 Books
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-primary">
            📝 Blog
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${phone}`}
            onClick={() => trackEvent("call_click", { location: "header" })}
            className="text-xl"
            aria-label="Call us"
            title={phone}
          >
            📞
          </a>
          <Link
            href="/contact-us"
            className="rounded-full bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="text-2xl text-primary lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-white px-4 py-4 lg:hidden">
          <Link href="/" className="block py-2 text-sm font-medium text-gray-700">
            Home
          </Link>
          <p className="pt-2 text-sm font-semibold text-gray-500">Courses</p>
          {courseLinks.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="block py-2 pl-3 text-sm text-gray-700"
            >
              {c.title}
            </Link>
          ))}
          <Link href="/books" className="block py-2 text-sm font-medium text-gray-700">
            Books
          </Link>
          <Link href="/blog" className="block py-2 text-sm font-medium text-gray-700">
            Blog
          </Link>
          <Link href="/contact-us" className="block py-2 text-sm font-medium text-gray-700">
            Contact Us
          </Link>
          <div className="mt-3 flex gap-2">
            <a
              href={`tel:${phone}`}
              className="flex-1 rounded-full border-2 border-primary py-2 text-center text-sm font-semibold text-primary"
            >
              📞 Call Now
            </a>
            <Link
              href="/free-trial-class"
              className="flex-1 rounded-full bg-gold py-2 text-center text-sm font-semibold text-white"
            >
              Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
