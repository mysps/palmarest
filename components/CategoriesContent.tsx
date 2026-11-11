"use client";

import Link from "next/link";
import { colourFor, emojiFor } from "@/lib/look";
import { useLang } from "@/lib/lang";
import type { Category } from "@/lib/venues";

export default function CategoriesContent({ categories }: { categories: Category[] }) {
  const { t } = useLang();
  return (
    <>
      <section className="hero hero-small">
        <h1>{t.categoriesHeading}</h1>
        <p className="lede">{t.categoriesLede}</p>
      </section>
      <ul className="moodgrid">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}/`} className={`mood bg-${colourFor(c.slug)}`}>
              <span className="mood-emoji" aria-hidden="true">
                {emojiFor(c.name)}
              </span>
              <span className="mood-name">{t.categories[c.name] ?? c.name}</span>
              <span className="mood-count">{t.regionPlaces(c.count)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
