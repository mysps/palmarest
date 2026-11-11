// Fallback map positions. A venue without its own lat/lng is drawn near the centre of its
// neighbourhood or town and labelled "approximate" until you run scripts/geocode.mjs.

export type Region = "palma" | "mallorca";

export const REGIONS: Record<Region, { name: string; heading: string; intro: string }> = {
  palma: {
    name: "Palma",
    heading: "Where to eat and drink in Palma",
    intro: "Restaurants, bars and cafés inside the city of Palma.",
  },
  mallorca: {
    name: "Rest of Mallorca",
    heading: "Where to eat and drink around Mallorca",
    intro: "Places worth the trip in the towns and villages outside Palma.",
  },
};

export const MALLORCA_BOUNDS: [[number, number], [number, number]] = [[39.26, 2.3], [39.97, 3.48]];

const CENTRES: Record<string, [number, number]> = {
  palma: [39.5696, 2.6502],
  "palma/centre": [39.5705, 2.65],
  "palma/ponent": [39.5745, 2.6385],
  "palma/llevant": [39.573, 2.659],
  "palma/nord": [39.584, 2.652],
  "palma/platja de palma": [39.522, 2.74],
  soller: [39.7665, 2.7152],
  "port de soller": [39.7958, 2.695],
  valldemossa: [39.7103, 2.6225],
  deia: [39.748, 2.649],
  alcudia: [39.853, 3.121],
  inca: [39.721, 2.911],
  felanitx: [39.469, 3.148],
  binissalem: [39.687, 2.844],
  algaida: [39.559, 2.894],
  calvia: [39.565, 2.506],
  llucmajor: [39.491, 2.891],
  "can picafort": [39.765, 3.154],
  palmanova: [39.52, 2.539],
  portals: [39.534, 2.57],
  portocolom: [39.417, 3.261],
  "santa maria del cami": [39.65, 2.775],
  "sa coma": [39.579, 3.375],
  selva: [39.755, 2.9],
  calonge: [39.4, 3.2],
  "son baulo": [39.76, 3.165],
  biniaraix: [39.771, 2.735],
  buger: [39.758, 2.984],
  campanet: [39.775, 2.965],
  "sant elm": [39.579, 2.352],
  "colonia de sant jordi": [39.317, 2.994],
  "son serra de marina": [39.734, 3.228],
};

const key = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

function jitter(seed: string, i: number) {
  let h = 2166136261 + i;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (((h >>> 0) % 1000) / 1000 - 0.5) * 0.004;
}

export type Pin = {
  slug: string;
  name: string;
  label: string;
  region: Region;
  lat: number;
  lng: number;
  approx: boolean;
};

type Locatable = {
  slug: string;
  name: string;
  category: string;
  region: Region;
  town: string;
  neighbourhood: string;
  lat: number | null;
  lng: number | null;
};

export function toPins(venues: Locatable[]): Pin[] {
  const pins: Pin[] = [];
  for (const v of venues) {
    const label = [v.category, v.neighbourhood || v.town].filter(Boolean).join(" · ");
    if (v.lat != null && v.lng != null) {
      pins.push({ slug: v.slug, name: v.name, label, region: v.region, lat: v.lat, lng: v.lng, approx: false });
      continue;
    }
    const town = key(v.town || (v.region === "palma" ? "palma" : ""));
    const centre = CENTRES[`${town}/${key(v.neighbourhood)}`] ?? CENTRES[town];
    if (!centre) continue; // unknown town and no coordinates: left off the map
    pins.push({
      slug: v.slug, name: v.name, label, region: v.region, approx: true,
      lat: centre[0] + jitter(v.slug, 1), lng: centre[1] + jitter(v.slug, 2),
    });
  }
  return pins;
}
