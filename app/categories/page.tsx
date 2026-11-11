import type { Metadata } from "next";
import CategoriesContent from "@/components/CategoriesContent";
import { getCategories } from "@/lib/venues";

export const metadata: Metadata = { title: "Pick a mood" };

export default function CategoriesPage() {
  const categories = getCategories();
  return <CategoriesContent categories={categories} />;
}
