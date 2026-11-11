import type { Metadata } from "next";
import Link from "next/link";
import { colourFor, emojiFor } from "@/lib/look";
import { getCategories } from "@/lib/venues";

export const metadata: Metadata = { title: "Pick a mood" };

export default function CategoriesPage() {
  const categories = getCategories();
  return (
    <>
      <section className="hero hero-small">
        <h1>Pick a mood</h1>
        <p className="lede">What do you fancy? Tap one to see every place that does it.</p>
      </section>
      <ul className="moodgrid">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}/`} className={`mood bg-${colourFor(c.slug)}`}>
              <span className="mood-emoji" aria-hidden="true">
                {emojiFor(c.name)}
              </span>
              <span className="mood-name">{c.name}</span>
              <span className="mood-count">{c.count === 1 ? "1 place" : `${c.count} places`}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
