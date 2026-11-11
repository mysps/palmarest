import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Directory from "@/components/Directory";
import { emojiFor } from "@/lib/look";
import { getCategories, getVenues } from "@/lib/venues";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const c = getCategories().find((x) => x.slug === slug);
  return c ? { title: `${c.name} in Mallorca`, alternates: { canonical: `/category/${slug}/` } } : {};
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).slug;
  const category = getCategories().find((c) => c.slug === slug);
  if (!category) notFound();
  const venues = getVenues().filter((v) => v.categorySlug === slug);

  return (
    <>
      <section className="hero hero-small">
        <Link href="/categories/" className="back">
          ← All moods
        </Link>
        <h1>
          <span aria-hidden="true">{emojiFor(category.name)}</span> {category.name}
        </h1>
        <p className="lede">
          {category.count === 1 ? "1 place" : `${category.count} places`} in Palma and the rest of Mallorca.
        </p>
      </section>
      <Directory venues={venues} lockCategory />
    </>
  );
}
