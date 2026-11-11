# Palma directory

A static Next.js site for Cloudflare Pages, with Cloudflare D1 as the database of approved venues.

```
data/venues.csv  --seed-->  D1 (venues table)  --pull at build-->  data/venues.json  -->  static pages in ./out
(all candidates)            (approved only)
```

Pages: home with search, `/palma/`, `/mallorca/` (rest of the island), `/categories/`, `/category/<type>/`,
`/map/`, and `/venue/<name>/` for every approved venue.

## Try it locally (no Cloudflare account needed)

```bash
npm install
npm run db:migrate:local   # creates the venues table in a local D1
npm run db:seed:local      # imports the approved rows from data/venues.csv
npm run dev                # http://localhost:3000   (or: npm run build)
```

## Approving a venue

In `data/venues.csv` a row is imported when all three are true:

- `screening_status` starts with `Verified`
- `restaurant_name` is filled in
- `region` is `palma` or `mallorca` (rest of the island). `outside` or blank is never imported.

Also fill `area` (the town, e.g. `Palma`, `Sóller`), `neighbourhood` (Palma only), `category`, `address`
and `description_en`. Then run `npm run db:seed:local` (or `:remote`). Seeding is safe to repeat: rows are
updated by Instagram handle, and a venue you un-approve is removed.

## Map pins

Run `npm run geocode -- you@example.com` to look up coordinates for approved venues that have an address,
using OpenStreetMap's free geocoder. Until a venue has `lat`/`lng`, its pin sits near the centre of its
neighbourhood or town and is labelled approximate. Google's coordinates are not used: its terms don't allow
storing them or showing them on a non-Google map.

## Matching more candidates to Google listings

```bash
GOOGLE_MAPS_API_KEY=your-key npm run match-google           # the "Likely food/drink venue" rows
GOOGLE_MAPS_API_KEY=your-key npm run match-google -- --all  # also "Needs manual review"
```

Open `data/google-matches.csv`, put `y` in the `ok` column for correct matches, then
`npm run match-google -- --apply`. Matches inside Palma get `region = palma`; for the others set `region`
and `area` yourself.

## Go live on Cloudflare

1. `npx wrangler login`
2. `npx wrangler d1 create palma-directory` and paste the printed `database_id` into `wrangler.toml`.
3. `npm run db:migrate:remote` then `npm run db:seed:remote`.
4. Push the folder to GitHub and create a Pages project from it:
   build command `npm run build`, output directory `out`.
5. In the Pages project settings add environment variables `NODE_VERSION` = `22`,
   `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_API_TOKEN` (a token with **D1: Read** permission).
   With the token set, each build reads the live D1 database.

Without the token the build falls back to the committed `data/venues.json`, so run `npm run db:pull -- --remote`
and commit that file if you prefer not to give the build a token.

To publish from your own machine instead: `npm run deploy`.

After changing venues: `npm run db:seed:remote`, then trigger a new deployment.

## Writing a blog article

Add a text file to `content/blog/`, for example `content/blog/best-vermut-in-palma.md`. The file name becomes
the web address (`/blog/best-vermut-in-palma/`).

```markdown
---
title: "Where to drink vermut in Palma"
date: 2026-11-20
summary: "One or two lines shown on the blog card and in Google results."
emoji: "🍷"
venues: [bodegamorey4, larosavermuteriaycolmado]   # optional: Instagram handles of listed venues
draft: false                                        # true hides the article
---

Write the article here in Markdown: `## Heading`, `**bold**`, `- lists`, `[links](https://...)`
and `![photo description](/images/my-photo.jpg)`.
```

Photos go in a `public/images/` folder. Venues named under `venues:` appear as cards below the article if they
are approved. Commit the file and redeploy; the three newest articles also show on the home page.

## Changing the look

Colours and fonts are the variables at the top of `app/globals.css`. The emoji for each category is set in
`lib/look.ts`.
