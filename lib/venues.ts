import fs from "node:fs";
import path from "node:path";
import type { Region } from "./geo";

// Shape of a row in the D1 `venues` table (see migrations/0001_init.sql).
type Row = {
  slug: string;
  name: string;
  instagram_username: string;
  instagram_url: string;
  region: Region;
  town: string;
  neighbourhood: string;
  category: string;
  category_slug: string;
  address: string;
  description_en: string;
  google_place_id: string;
  lat: number | null;
  lng: number | null;
  verified_on: string;
};

export type Venue = {
  slug: string;
  name: string;
  handle: string;
  instagramUrl: string;
  region: Region;
  town: string;
  neighbourhood: string;
  category: string;
  categorySlug: string;
  address: string;
  description: string;
  placeId: string;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
  verifiedOn: string;
};

export type Category = { slug: string; name: string; count: number };

function mapsUrl(r: Row) {
  const where = r.address || [r.town, "Mallorca"].filter(Boolean).join(", ");
  const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name}, ${where}`)}`;
  return r.google_place_id ? `${base}&query_place_id=${r.google_place_id}` : base;
}

let cache: Venue[] | null = null;

/** Venues come from data/venues.json, which scripts/pull-d1.mjs refreshes from D1 before each build. */
export function getVenues(): Venue[] {
  if (cache) return cache;
  const rows = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "venues.json"), "utf8")) as Row[];
  cache = rows
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      handle: r.instagram_username,
      instagramUrl: r.instagram_url,
      region: r.region,
      town: r.town,
      neighbourhood: r.neighbourhood,
      category: r.category,
      categorySlug: r.category_slug,
      address: r.address,
      description: r.description_en,
      placeId: r.google_place_id,
      mapsUrl: mapsUrl(r),
      lat: r.lat,
      lng: r.lng,
      verifiedOn: r.verified_on,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  return cache;
}

export const getVenue = (slug: string) => getVenues().find((v) => v.slug === slug);

export function getCategories(venues = getVenues()): Category[] {
  const map = new Map<string, Category>();
  for (const v of venues) {
    if (!v.categorySlug) continue;
    const c = map.get(v.categorySlug) ?? { slug: v.categorySlug, name: v.category, count: 0 };
    c.count++;
    map.set(v.categorySlug, c);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}
