"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "🏝️", match: (p: string) => p === "/" },
  { href: "/categories/", label: "Moods", icon: "🍸", match: (p: string) => p.startsWith("/categor") },
  { href: "/map/", label: "Map", icon: "🗺️", match: (p: string) => p.startsWith("/map") },
  { href: "/blog/", label: "Blog", icon: "✍️", match: (p: string) => p.startsWith("/blog") },
];

/** One set of links: a thumb-reach tab bar on phones, a plain row in the header on wide screens. */
export default function TabBar() {
  const path = usePathname() ?? "/";
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={t.match(path) ? "page" : undefined}>
          <span className="tab-icon" aria-hidden="true">
            {t.icon}
          </span>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
