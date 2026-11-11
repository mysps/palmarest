#!/usr/bin/env node
// Turn the approved rows of data/venues.csv into db/seed.sql for Cloudflare D1.
// Approved = screening_status starts with "Verified", has a restaurant_name, and region is palma or mallorca.
// Re-running is safe: rows are upserted by Instagram handle, and venues you un-approve are removed.

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const q = (v) => (v === null || v === undefined || v === "" ? "''" : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v !== "" && Number.isFinite(Number(v)) ? Number(v) : "NULL");

const rows = parse(fs.readFileSync(path.join("data", "venues.csv"), "utf8"), { columns: true, skip_empty_lines: true, bom: true });
const approved = rows.filter(
  (r) => r.screening_status?.startsWith("Verified") && r.restaurant_name && ["palma", "mallorca"].includes(r.region)
);

const seen = new Set();
const cols = "slug, name, instagram_username, instagram_url, region, town, neighbourhood, category, category_slug, address, description_en, google_place_id, lat, lng, verified_on";
const update = cols.split(", ").filter((c) => c !== "instagram_username").map((c) => `${c} = excluded.${c}`).join(", ");

const statements = approved.map((r) => {
  let slug = slugify(r.restaurant_name);
  if (seen.has(slug)) slug = `${slug}-${slugify(r.instagram_username)}`;
  seen.add(slug);
  const values = [
    q(slug), q(r.restaurant_name), q(r.instagram_username), q(r.instagram_url), q(r.region), q(r.area),
    q(r.neighbourhood), q(r.category), q(slugify(r.category || "")), q(r.address), q(r.description_en),
    q(r.google_place_id), num(r.lat), num(r.lng), q(r.verified_on),
  ].join(", ");
  return `INSERT INTO venues (${cols}) VALUES (${values})\n  ON CONFLICT (instagram_username) DO UPDATE SET ${update}, updated_at = datetime('now');`;
});

const keep = approved.map((r) => q(r.instagram_username)).join(", ");
statements.push(`DELETE FROM venues WHERE instagram_username NOT IN (${keep || "''"});`);

fs.mkdirSync("db", { recursive: true });
fs.writeFileSync(path.join("db", "seed.sql"), statements.join("\n") + "\n");
console.log(`db/seed.sql: ${approved.length} approved venues (${rows.length - approved.length} candidates not imported).`);
