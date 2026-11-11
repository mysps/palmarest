import type { MetadataRoute } from "next";
import { REGIONS } from "@/lib/geo";
import { getPosts } from "@/lib/blog";
import { getCategories, getVenues } from "@/lib/venues";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...Object.keys(REGIONS).map((r) => `/${r}/`),
    "/categories/",
    "/map/",
    "/blog/",
    ...getPosts().map((p) => `/blog/${p.slug}/`),
    ...getCategories().map((c) => `/category/${c.slug}/`),
    ...getVenues().map((v) => `/venue/${v.slug}/`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
