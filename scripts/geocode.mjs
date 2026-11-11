#!/usr/bin/env node
// Fill in lat/lng for approved venues that have an address, using OpenStreetMap's free geocoder (Nominatim).
// OpenStreetMap coordinates can be stored and shown on the map; Google's cannot.
//   node scripts/geocode.mjs you@example.com     (Nominatim asks for a contact address in the request)
// Then: npm run db:seed:local (or :remote) and rebuild.

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const contact = process.argv[2];
if (!contact) {
  console.error("Usage: node scripts/geocode.mjs you@example.com");
  process.exit(1);
}

const FILE = path.join("data", "venues.csv");
const rows = parse(fs.readFileSync(FILE, "utf8"), { columns: true, skip_empty_lines: true, bom: true });
const todo = rows.filter((r) => r.screening_status?.startsWith("Verified") && r.address && !r.lat);
console.log(`Geocoding ${todo.length} addresses...`);

for (const r of todo) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({ q: `${r.address}, Mallorca`, format: "jsonv2", limit: "1", countrycodes: "es" });
  try {
    const res = await fetch(url, { headers: { "User-Agent": `palma-directory (${contact})` } });
    const [hit] = await res.json();
    if (hit) {
      r.lat = Number(hit.lat).toFixed(6);
      r.lng = Number(hit.lon).toFixed(6);
      console.log(`  ${r.restaurant_name}: ${r.lat}, ${r.lng}`);
    } else {
      console.log(`  ${r.restaurant_name}: not found, add lat/lng by hand`);
    }
  } catch (e) {
    console.error(`  ${r.restaurant_name}: ${e.message}`);
  }
  await new Promise((s) => setTimeout(s, 1100)); // Nominatim allows one request per second
}

fs.writeFileSync(FILE, stringify(rows, { header: true, columns: Object.keys(rows[0]) }));
