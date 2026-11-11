import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/onest";
import Footer from "@/components/Footer";
import LangToggle from "@/components/LangToggle";
import TabBar from "@/components/TabBar";
import { LangProvider } from "@/lib/lang";
import { site } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#ff2e88" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <header className="top">
            <Link href="/" className="logo">
              {site.name}
            </Link>
            <TabBar />
            <LangToggle />
          </header>
          <main>{children}</main>
          <Footer contactUrl={site.contactUrl} />
        </LangProvider>
      </body>
    </html>
  );
}
