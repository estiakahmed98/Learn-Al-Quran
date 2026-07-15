import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import { routing } from "@/i18n/routing";

export const metadata = {
  robots: { index: false, follow: false }
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;

  return (
    <html lang={routing.defaultLocale}>
      <body className="flex min-h-screen flex-col font-body">
        <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
