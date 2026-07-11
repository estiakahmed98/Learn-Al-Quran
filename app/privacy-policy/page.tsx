import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy of Learn Al Quran Online BD.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false }
};

export const revalidate = 3600;

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary-dark">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

      {settings.privacyPolicy ? (
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-gray-700">
          {settings.privacyPolicy}
        </div>
      ) : (
        <div className="prose prose-lg mt-8 max-w-none text-gray-700">
          <p>
            Learn Al Quran Online BD ("we", "our", "us") respects your privacy. This policy
            explains what information we collect through our website and enrollment forms, and
            how we use it.
          </p>
          <h2>Information We Collect</h2>
          <p>
            When you submit our Free Trial or Admission form, we collect your name, WhatsApp
            number, contact number, optional email address, and payment/transaction details you
            provide, solely to process your enrollment and communicate with you.
          </p>
          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to schedule classes, verify payments, respond to enquiries,
            and improve our services. We do not sell or rent your personal data to third parties.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have questions about this policy, contact us at {settings.email}.
          </p>
        </div>
      )}
    </div>
  );
}
