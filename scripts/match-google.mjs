#!/usr/bin/env node
// Match unverified rows in data/venues.csv to Google Maps listings, using YOUR Google Places API key.
//
//   GOOGLE_MAPS_API_KEY=xxx node scripts/match-google.mjs          -> writes data/google-matches.csv for review
//   node scripts/match-google.mjs --apply                          -> copies rows you marked ok=y into venues.csv
//
// Review step: open data/google-matches.csv, put "y" in the ok column for correct matches, then run --apply.
// Only the place ID, the venue name you confirmed and a category guess are written to venues.csv.
// Google's terms let you keep place IDs but not copy listing content (address, hours, ratings, reviews, photos),
// so the site links to / embeds the live listing instead. Delete google-matches.csv once you have applied it.

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const VENUES = path.join(process.cwd(), "data", "venues.csv");
const MATCHES = path.join(process.cwd(), "data", "google-matches.csv");
const PALMA = { latitude: 39.5696, longitude: 2.6502 };

const read = (file) => parse(fs.readFileSync(file, "utf8"), { columns: true, skip_empty_lines: true, bom: true });
const write = (file, rows, columns) => fs.writeFileSync(file, stringify(rows, { header: true, columns }));

const CATEGORY = [
  ["cocktail_bar", "Cocktail bar"], ["wine_bar", "Wine bar"], ["pub", "Pub"], ["pizza_restaurant", "Pizzeria"],
  ["sushi_restaurant", "Japanese restaurant"], ["japanese_restaurant", "Japanese restaurant"],
  ["ramen_restaurant", "Ramen restaurant"], ["thai_restaurant", "Thai restaurant"],
  ["indian_restaurant", "Indian restaurant"], ["mexican_restaurant", "Mexican restaurant"],
  ["italian_restaurant", "Italian restaurant"], ["hamburger_restaurant", "Burger restaurant"],
  ["vegan_restaurant", "Vegan restaurant"], ["vegetarian_restaurant", "Vegetarian restaurant"],
  ["ice_cream_shop", "Ice cream shop"], ["bakery", "Bakery"], ["coffee_shop", "Café"], ["cafe", "Café"],
  ["spanish_restaurant", "Spanish restaurant"], ["mediterranean_restaurant", "Mediterranean restaurant"],
  ["bar", "Bar"], ["restaurant", "Restaurant"],
];
const guessCategory = (types = []) => CATEGORY.find(([t]) => types.includes(t))?.[1] ?? "";

async function search(query, key) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.types,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 1,
      languageCode: "es",
      locationBias: { circle: { center: PALMA, radius: 12000 } },
    }),
  });
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
  return (await res.json()).places?.[0];
}

async function lookup() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Set GOOGLE_MAPS_API_KEY first.");
  const includeReview = process.argv.includes("--all");
  const todo = read(VENUES).filter(
    (r) =>
      !r.google_place_id &&
      (r.screening_status === "Likely food/drink venue" || (includeReview && r.screening_status === "Needs manual review"))
  );
  console.log(`Looking up ${todo.length} accounts...`);
  const out = [];
  for (const r of todo) {
    const query = `${r.instagram_username.replace(/[._]+/g, " ").trim()} Palma de Mallorca`;
    try {
      const p = await search(query, key);
      out.push({
        ok: "",
        instagram_username: r.instagram_username,
        instagram_url: r.instagram_url,
        google_name: p?.displayName?.text ?? "",
        google_address: p?.formattedAddress ?? "",
        in_palma: p ? (/\bPalma\b/.test(p.formattedAddress ?? "") ? "yes" : "no") : "",
        status: p?.businessStatus ?? "NO_MATCH",
        category_guess: guessCategory(p?.types),
        google_place_id: p?.id ?? "",
      });
    } catch (e) {
      console.error(r.instagram_username, e.message);
    }
    await new Promise((s) => setTimeout(s, 150));
  }
  write(MATCHES, out);
  console.log(`Wrote ${MATCHES}. Mark correct rows with ok=y, then run with --apply.`);
}

function apply() {
  const approved = new Map(read(MATCHES).filter((m) => m.ok.trim().toLowerCase() === "y").map((m) => [m.instagram_username, m]));
  const rows = read(VENUES);
  const today = new Date().toISOString().slice(0, 10);
  let n = 0;
  for (const r of rows) {
    const m = approved.get(r.instagram_username);
    if (!m) continue;
    r.screening_status = "Verified venue (Google match)";
    r.restaurant_name ||= m.google_name;
    if (m.in_palma === "yes") {
      r.region ||= "palma";
      r.area ||= "Palma";
    } // otherwise set region (mallorca) and area (the town) yourself before it is published
    r.category ||= m.category_guess;
    r.google_place_id = m.google_place_id;
    r.verification_source ||= `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.google_name)}&query_place_id=${m.google_place_id}`;
    r.verified_on = today;
    n++;
  }
  write(VENUES, rows, Object.keys(rows[0]));
  console.log(`Published ${n} venues. Add your own description_en, neighbourhood and address for each, then rebuild.`);
}

(process.argv.includes("--apply") ? Promise.resolve().then(apply) : lookup()).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
