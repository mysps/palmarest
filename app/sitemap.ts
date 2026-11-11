import type { MetadataRoute } from "next";
import { REGIONS } from "@/lib/geo";
import { getPosts } from "@/lib/blog";
import { getCategories, getVenues } from "@/lib/venues";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    ...Object.keys(REGIONS).map((r) => ({
      url: `${base}/${r}/`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    { url: `${base}/categories/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/map/`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/`, changeFrequency: "weekly", priority: 0.7 },
    ...getPosts().map((p) => ({
      url: `${base}/blog/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getCategories().map((c) => ({
      url: `${base}/category/${c.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getVenues().map((v) => ({
      url: `${base}/venue/${v.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
