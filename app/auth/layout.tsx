import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import { routing } from "@/i18n/routing";
import AuthProvider from "@/components/admin/AuthProvider";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/site-config";
import { getCachedActiveCourses } from "@/lib/cached-data";

export const metadata = {
  robots: { index: false, follow: false }
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const [messages, settings, courses] = await Promise.all([
    import(`../../messages/${routing.defaultLocale}.json`).then((module) => module.default),
    getSiteSettings(),
    getCachedActiveCourses().catch(() => []),
  ]);

  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-body">
        <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
          <AuthProvider>
            <TopBar phone={settings.phone || ""} />
            <Header
              phone={settings.phone || ""}
              siteName={settings.siteName}
              logo={settings.logo}
              courses={courses}
            />
            <main className="flex flex-1">{children}</main>
            <Footer
              phone={settings.phone || ""}
              whatsapp={settings.whatsapp || ""}
              email={settings.email || ""}
              address={settings.address || ""}
              socialLinks={settings.socialLinks}
              copyrightText={settings.copyrightText}
              siteName={settings.siteName}
              logo={settings.logo}
            />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
