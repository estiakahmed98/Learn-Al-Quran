"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

const courseLinks = [
  { title: "Smart Maktab Learning", slug: "smart-maktab-learning", icon: "🕌" },
  { title: "Tajweed Master Course", slug: "tajweed-master-course", icon: "🎙" },
  { title: "Complete Nazera Quran", slug: "complete-nazera-quran", icon: "📗" },
  { title: "Complete Hifzul Quran", slug: "complete-hifzul-quran", icon: "📘" },
  { title: "Adult Quran Learning", slug: "adult-quran-learning", icon: "🧕" },
  { title: "English Speaking", slug: "english-speaking", icon: "🗣" },
];

function UserAvatar({
  name,
  image,
  size = "h-9 w-9",
}: {
  name?: string | null;
  image?: string | null;
  size?: string;
}) {
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
      className={`${size} flex items-center justify-center rounded-full border-2 border-gold bg-gold/20 text-sm font-bold text-gold`}
    >
      {(name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

export default function Header({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const t = useTranslations("header");
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (href: string) =>
    `relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-gold after:transition-all ${
      isActive(href)
        ? "text-gold after:w-full"
        : "text-white/85 hover:text-gold after:w-0 hover:after:w-full"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-primary-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Learn_Al_Quran_Logo.png"
            alt="Learn Al Quran Online BD logo"
            className="h-11 w-11 shrink-0 rounded-full border-2 border-gold/40 object-cover"
          />
          <span className="leading-tight">
            <span className="block font-heading text-base font-bold uppercase tracking-wide text-white lg:text-lg">
              Learn Al Quran
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
              Online BD
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/" className={navLinkClass("/")}>
            {t("home")}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCoursesOpen(true)}
            onMouseLeave={() => setCoursesOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors ${
                coursesOpen ? "text-gold" : "text-white/85 hover:text-gold"
              }`}
            >
              {t("courses")}
              <span
                className={`text-[10px] transition-transform duration-200 ${
                  coursesOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            <div
              className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition-all duration-200 ${
                coursesOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-gold/15 bg-white shadow-2xl shadow-black/20">
                <p className="border-b border-gold/10 bg-cream px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary-dark/60">
                  {t("courses")}
                </p>
                <div className="py-1.5">
                  {courseLinks.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/courses/${c.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-cream hover:text-primary-dark"
                    >
                      <span className="text-base">{c.icon}</span>
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link href="/books" className={navLinkClass("/books")}>
            {t("books")}
          </Link>
          <Link href="/blog" className={navLinkClass("/blog")}>
            {t("blog")}
          </Link>

          <Link
            href="/#courses"
            className="flex items-center gap-2 rounded-full border border-gold bg-gold px-5 py-2 text-sm font-bold uppercase tracking-wide text-primary-dark shadow-sm transition hover:bg-gold-light"
          >
            <span>★</span> {t("masterClasses")}
          </Link>
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact-us"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
          >
            {t("contactUs")}
          </Link>

          <div className="border-l border-white/15 pl-3">
            <LocaleSwitcher />
          </div>

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

                <div
                  className={`absolute right-0 top-full w-60 pt-3 transition-all duration-200 ${
                    profileOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-xl border border-gold/15 bg-white shadow-2xl shadow-black/20">
                    <div className="border-b border-gray-100 bg-cream px-4 py-3">
                      <p className="truncate text-sm font-semibold text-primary-dark">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={
                        user.role === "ADMIN" ? "/admin" : "/student/dashboard"
                      }
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-cream hover:text-primary-dark"
                    >
                      {user.role === "ADMIN"
                        ? `🛠 ${t("adminPanel")}`
                        : `🎓 ${t("myDashboard")}`}
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      ↩ {t("signOut")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border-2 border-gold px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-primary-dark"
              >
                {t("login")}
              </Link>
            ))}
        </div>

        {/* Mobile trigger area */}
        <div className="flex items-center gap-3 lg:hidden">
          {status !== "loading" && user && (
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"}
              aria-label={t("myDashboard")}
            >
              <UserAvatar name={user.name} image={user.image} size="h-8 w-8" />
            </Link>
          )}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl text-gold transition hover:border-gold"
            onClick={() => setOpen(!open)}
            aria-label={t("toggleMenu")}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-gold/20 bg-primary-dark transition-all duration-300 lg:hidden ${
          open ? "max-h-[calc(100vh-4rem)] overflow-y-auto" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
              isActive("/") ? "bg-white/10 text-gold" : "text-white/85"
            }`}
          >
            {t("home")}
          </Link>

          <button
            onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white/85"
          >
            {t("courses")}
            <span
              className={`text-xs transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              mobileCoursesOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="ml-2 border-l border-gold/20 pl-3">
              {courseLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-white/70 hover:text-gold"
                >
                  <span>{c.icon}</span> {c.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/books"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85"
          >
            {t("books")}
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85"
          >
            {t("blog")}
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85"
          >
            {t("contactUs")}
          </Link>

          <div className="my-3 h-px bg-white/10" />

          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gold"
              >
                {user.role === "ADMIN"
                  ? `🛠 ${t("adminPanel")}`
                  : `🎓 ${t("myDashboard")}`}
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400"
              >
                ↩ {t("signOut")}
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gold"
            >
              🔑 {t("loginSignup")}
            </Link>
          )}

          <div className="mt-3">
            <LocaleSwitcher />
          </div>

          <div className="mt-4">
            <Link
              href="/free-trial-class"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gold py-2.5 text-center text-sm font-semibold text-primary-dark"
            >
              {t("freeTrial")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
