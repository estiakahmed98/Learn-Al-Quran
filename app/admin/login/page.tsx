"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-lg">
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl text-white">
              🕌
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary-dark">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-gray-500">Learn Al Quran Online BD</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Authorized administrators only.
        </p>
      </div>
    </div>
  );
}
