"use client";

import Link from "next/link";
import { emojiFor } from "@/lib/look";
import { useLang } from "@/lib/lang";

export default function CategoryHero({ name, count }: { name: string; count: number }) {
  const { t } = useLang();
  const translatedName = t.categories[name] ?? name;
  return (
    <section className="hero hero-small">
      <Link href="/categories/" className="back">
        {t.allMoods}
      </Link>
      <h1>
        <span aria-hidden="true">{emojiFor(name)}</span> {translatedName}
      </h1>
      <p className="lede">{t.categoryLede(count, translatedName)}</p>
    </section>
  );
}
