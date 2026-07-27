"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setError(t("invalidCredentials"));
      return;
    }

    const session = await getSession();
    const isStaff =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEACHER";
    const destination =
      callbackUrl || (isStaff ? "/admin" : "/student/dashboard");

    router.push(destination);
    router.refresh();
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gold/20 bg-white p-8 shadow-lg">
        <h1 className="text-center font-heading text-xl font-bold text-primary-dark">
          {t("loginTitle")}
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          {t("siteName")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("password")}
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 transition hover:text-primary focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? t("signingIn") : t("signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
