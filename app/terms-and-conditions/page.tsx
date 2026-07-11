import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for enrolling in Learn Al Quran Online BD courses.",
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: false }
};

export const revalidate = 3600;

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary-dark">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

      {settings.terms ? (
        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line text-gray-700">
          {settings.terms}
        </div>
      ) : (
        <div className="prose prose-lg mt-8 max-w-none text-gray-700">
          <h2>Enrollment</h2>
          <p>
            Enrollment is confirmed only after the course fee (৳1500) has been paid via bKash,
            Nagad, Rocket, Bank Transfer, or Western Union, and the Admission Form has been
            submitted with a valid Transaction ID.
          </p>
          <h2>Refund Policy</h2>
          <p>
            Fees are non-refundable once a teacher has been assigned and classes have started,
            except in cases where Learn Al Quran Online BD is unable to provide a suitable
            teacher.
          </p>
          <h2>Class Schedule</h2>
          <p>
            Class timing is arranged based on mutual availability between the student and
            teacher. Rescheduling requests should be made at least 12 hours in advance.
          </p>
          <h2>Conduct</h2>
          <p>
            Students and parents are expected to maintain respectful conduct during classes.
            Learn Al Quran Online BD reserves the right to suspend access for any breach of
            conduct.
          </p>
          <h2>Contact</h2>
          <p>For any questions about these terms, please contact us at {settings.email}.</p>
        </div>
      )}
    </div>
  );
}
