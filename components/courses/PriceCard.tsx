"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
  slug: string;
  fee: number;
  originalFee: number | null;
  discountPercent: number | null;
  couponCode: string | null;
  couponPercent: number | null;
  bannerImage: string | null;
  title: string;
  deadlineText: string | null;
}

export default function PriceCard({
  slug,
  fee,
  originalFee,
  discountPercent,
  couponCode,
  couponPercent,
  bannerImage,
  title,
  deadlineText
}: Props) {
  const t = useTranslations("courseDetail");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const finalFee =
    applied && couponPercent ? Math.max(0, Math.round(fee - (fee * couponPercent) / 100)) : fee;

  function applyCoupon() {
    if (!couponCode || !couponPercent) return;
    if (code.trim().toLowerCase() === couponCode.toLowerCase()) {
      setApplied(true);
      setCouponError(false);
    } else {
      setApplied(false);
      setCouponError(true);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      {bannerImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bannerImage} alt={title} className="aspect-video w-full object-cover" />
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold text-primary-dark">৳{finalFee.toLocaleString()}</span>
          {applied ? (
            <span className="text-lg text-gray-400 line-through">৳{fee.toLocaleString()}</span>
          ) : (
            originalFee &&
            originalFee > fee && (
              <span className="text-lg text-gray-400 line-through">
                ৳{originalFee.toLocaleString()}
              </span>
            )
          )}
          {applied && couponPercent ? (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary-dark">
              {t("discountOff", { percent: couponPercent })}
            </span>
          ) : (
            discountPercent && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary-dark">
                {t("discountOff", { percent: discountPercent })}
              </span>
            )
          )}
        </div>

        {couponCode && couponPercent ? (
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCouponError(false);
              }}
              placeholder={t("couponPlaceholder")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="shrink-0 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-primary hover:text-white"
            >
              {t("apply")}
            </button>
          </div>
        ) : null}
        {couponError && <p className="mt-2 text-xs text-red-500">{t("invalidCoupon")}</p>}
        {applied && <p className="mt-2 text-xs font-semibold text-secondary">{t("couponApplied")}</p>}

        <Link
          href={`/enroll?course=${slug}${applied ? `&coupon=${couponCode}` : ""}`}
          className="mt-5 block rounded-xl bg-gold py-3.5 text-center font-bold text-primary-dark shadow-lg transition hover:bg-gold-light"
        >
          {t("enrollInCourse")}
        </Link>

        {deadlineText && (
          <p className="mt-3 text-center text-sm font-semibold text-red-600">
            {t("enrollDeadline")}: {deadlineText}
          </p>
        )}
      </div>
    </div>
  );
}
