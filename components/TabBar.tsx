"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang";

const TABS = [
  { href: "/", icon: "🏝️", key: "tabHome" as const, match: (p: string) => p === "/" },
  { href: "/categories/", icon: "🍸", key: "tabMoods" as const, match: (p: string) => p.startsWith("/categor") },
  { href: "/map/", icon: "🗺️", key: "tabMap" as const, match: (p: string) => p.startsWith("/map") },
  { href: "/blog/", icon: "✍️", key: "tabBlog" as const, match: (p: string) => p.startsWith("/blog") },
];

/** One set of links: a thumb-reach tab bar on phones, a plain row in the header on wide screens. */
export default function TabBar() {
  const path = usePathname() ?? "/";
  const { t } = useLang();
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={tab.match(path) ? "page" : undefined}>
          <span className="tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
          {t[tab.key]}
        </Link>
      ))}
    </nav>
  );
}
