#!/usr/bin/env node
// Runs before every build: reads the venues table from D1 into data/venues.json, which the pages are built from.
// Uses the live database when CLOUDFLARE_API_TOKEN is set (or with --remote), otherwise your local D1.
// If D1 can't be reached, the last saved data/venues.json is used so the build still works.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join("data", "venues.json");
const remote = process.argv.includes("--remote") || (!!process.env.CLOUDFLARE_API_TOKEN && !process.argv.includes("--local"));
const mode = remote ? "--remote" : "--local";

try {
  const stdout = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "palma-directory", mode, "--json", "--command", "SELECT * FROM venues ORDER BY name COLLATE NOCASE"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 }
  );
  const start = stdout.search(/^\s*[\[{]/m);
  const parsed = JSON.parse(stdout.slice(start));
  const venues = (Array.isArray(parsed) ? parsed[0] : parsed).results;
  if (!Array.isArray(venues)) throw new Error("Unexpected response from wrangler");
  fs.writeFileSync(OUT, JSON.stringify(venues, null, 2) + "\n");
  console.log(`Pulled ${venues.length} venues from D1 (${remote ? "remote" : "local"}).`);
} catch (e) {
  const detail = (e.stderr || e.message || "").toString().trim().split("\n").slice(-3).join(" ");
  if (fs.existsSync(OUT)) {
    console.warn(`Could not read D1 (${remote ? "remote" : "local"}): ${detail}\nUsing the saved ${OUT} instead.`);
  } else {
    console.error(`Could not read D1 and there is no saved ${OUT}: ${detail}`);
    process.exit(1);
  }
}
