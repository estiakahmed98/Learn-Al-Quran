import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center lg:px-8">
      <p className="font-heading text-7xl font-bold text-primary/20">404</p>
      <h1 className="mt-4 font-heading text-3xl font-bold text-primary-dark">{t("title")}</h1>
      <p className="mt-3 max-w-md text-gray-500">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-bold text-white hover:bg-primary-dark"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
