import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/onest";
import TabBar from "@/components/TabBar";
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
        <header className="top">
          <Link href="/" className="logo">
            {site.name}
          </Link>
          <TabBar />
        </header>
        <main>{children}</main>
        <footer className="foot">
          <p>
            An independent guide. Hours and photos live on each venue&apos;s own Instagram and Google Maps pages.
          </p>
          {site.contactUrl ? (
            <p>
              Your place is listed and something&apos;s wrong? <a href={site.contactUrl}>Tell us</a>.
            </p>
          ) : null}
        </footer>
      </body>
    </html>
  );
}
