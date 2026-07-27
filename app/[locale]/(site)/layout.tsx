import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import { getSiteSettings } from "@/lib/site-config";
import { getCachedActiveCourses } from "@/lib/cached-data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    getCachedActiveCourses().catch(() => []),
  ]);

  return (
    <>
      <TopBar phone={settings.phone || ""} />
      <Header
        phone={settings.phone || ""}
        siteName={settings.siteName}
        logo={settings.logo}
        courses={courses}
      />
      <main className="flex-1">{children}</main>
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
      <WhatsAppFloat whatsapp={settings.whatsapp || ""} />
    </>
  );
}
