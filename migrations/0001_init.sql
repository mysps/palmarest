-- Approved venues only. Candidates stay in data/venues.csv until you mark them Verified.
CREATE TABLE IF NOT EXISTS venues (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  slug               TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL,
  instagram_username TEXT NOT NULL UNIQUE,
  instagram_url      TEXT NOT NULL,
  region             TEXT NOT NULL CHECK (region IN ('palma', 'mallorca')),
  town               TEXT NOT NULL DEFAULT '',
  neighbourhood      TEXT NOT NULL DEFAULT '',
  category           TEXT NOT NULL DEFAULT '',
  category_slug      TEXT NOT NULL DEFAULT '',
  address            TEXT NOT NULL DEFAULT '',
  description_en     TEXT NOT NULL DEFAULT '',
  google_place_id    TEXT NOT NULL DEFAULT '',
  lat                REAL,
  lng                REAL,
  verified_on        TEXT NOT NULL DEFAULT '',
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_venues_region ON venues (region);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues (category_slug);
