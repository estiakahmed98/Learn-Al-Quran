"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

const courseLinks = [
  { title: "Smart Maktab Learning", slug: "smart-maktab-learning" },
  { title: "Tajweed Master Course", slug: "tajweed-master-course" },
  { title: "Complete Nazera Quran", slug: "complete-nazera-quran" },
  { title: "Complete Hifzul Quran", slug: "complete-hifzul-quran" },
  { title: "Adult Quran Learning", slug: "adult-quran-learning" },
  { title: "English Speaking", slug: "english-speaking" }
];

function UserAvatar({ name, image, size = "h-9 w-9" }: { name?: string | null; image?: string | null; size?: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || "Profile"}
        className={`${size} rounded-full border-2 border-gold object-cover`}
      />
    );
  }
  return (
    <span
      className={`${size} flex items-center justify-center rounded-full border-2 border-gold bg-primary text-sm font-bold text-white`}
    >
      {(name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

export default function Header({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Learn_Al_Quran_Logo.png"
            alt="Learn Al Quran Online BD logo"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <span className="leading-tight">
            <span className="block font-heading text-base font-bold uppercase tracking-wide text-primary-dark lg:text-lg">
              Learn Al Quran
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
              Online BD
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary">
            {t("home")}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCoursesOpen(true)}
            onMouseLeave={() => setCoursesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary">
              {t("courses")} <span className="text-xs">▾</span>
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
            <span className="text-gold-light">★</span> {t("masterClasses")}
          </Link>

          <Link href="/books" className="text-sm font-medium text-gray-700 hover:text-primary">
            📖 {t("books")}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-primary">
            📝 {t("blog")}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${phone}`}
            onClick={() => trackEvent("call_click", { location: "header" })}
            className="text-xl"
            aria-label={t("callUs")}
            title={phone}
          >
            📞
          </a>
          <Link
            href="/contact-us"
            className="rounded-full bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary"
          >
            {t("contactUs")}
          </Link>
          <LocaleSwitcher />

          {status !== "loading" &&
            (user ? (
              <div
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label={t("profileMenu")}
                  className="flex items-center"
                >
                  <UserAvatar name={user.name} image={user.image} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full w-56 rounded-lg border border-gold/20 bg-white py-2 shadow-xl">
                    <div className="border-b border-gray-100 px-4 pb-2">
                      <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-cream hover:text-primary"
                    >
                      {user.role === "ADMIN" ? `🛠 ${t("adminPanel")}` : `🎓 ${t("myDashboard")}`}
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      ↩ {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border-2 border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                {t("login")}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {status !== "loading" && user && (
            <Link href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"} aria-label={t("myDashboard")}>
              <UserAvatar name={user.name} image={user.image} size="h-8 w-8" />
            </Link>
          )}
          <button
            className="text-2xl text-primary"
            onClick={() => setOpen(!open)}
            aria-label={t("toggleMenu")}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-white px-4 py-4 lg:hidden">
          <Link href="/" className="block py-2 text-sm font-medium text-gray-700">
            {t("home")}
          </Link>
          <p className="pt-2 text-sm font-semibold text-gray-500">{t("courses")}</p>
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
            {t("books")}
          </Link>
          <Link href="/blog" className="block py-2 text-sm font-medium text-gray-700">
            {t("blog")}
          </Link>
          <Link href="/contact-us" className="block py-2 text-sm font-medium text-gray-700">
            {t("contactUs")}
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                className="block py-2 text-sm font-medium text-primary"
              >
                {user.role === "ADMIN" ? `🛠 ${t("adminPanel")}` : `🎓 ${t("myDashboard")}`}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block py-2 text-sm font-medium text-red-600"
              >
                ↩ {t("signOut")}
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="block py-2 text-sm font-medium text-primary">
              🔑 {t("loginSignup")}
            </Link>
          )}
          <div className="mt-3">
            <LocaleSwitcher />
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={`tel:${phone}`}
              className="flex-1 rounded-full border-2 border-primary py-2 text-center text-sm font-semibold text-primary"
            >
              📞 {t("callNow")}
            </a>
            <Link
              href="/free-trial-class"
              className="flex-1 rounded-full bg-gold py-2 text-center text-sm font-semibold text-primary-dark"
            >
              {t("freeTrial")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
