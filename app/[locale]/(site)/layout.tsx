import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import { getSiteSettings } from "@/lib/site-config";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <TopBar phone={settings.phone || ""} />
      <Header
        phone={settings.phone || ""}
        siteName={settings.siteName}
        logo={settings.logo}
      />
      <main className="flex-1">{children}</main>
      <Footer
        phone={settings.phone || ""}
        whatsapp={settings.whatsapp || ""}
        email={settings.email || ""}
        address={settings.address || ""}
        facebookUrl={settings.facebookUrl}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
        linkedinUrl={settings.linkedinUrl}
        copyrightText={settings.copyrightText}
        siteName={settings.siteName}
        logo={settings.logo}
      />
      <WhatsAppFloat whatsapp={settings.whatsapp || ""} />
    </>
  );
}
