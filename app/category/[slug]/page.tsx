import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryHero from "@/components/CategoryHero";
import Directory from "@/components/Directory";
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
      <CategoryHero name={category.name} count={category.count} />
      <Directory venues={venues} lockCategory />
    </>
  );
}
