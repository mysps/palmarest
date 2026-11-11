"use client";

import { useEffect, useMemo, useState } from "react";
import VenueCard from "@/components/VenueCard";
import { REGIONS, type Region } from "@/lib/geo";
import { emojiFor } from "@/lib/look";
import type { Venue } from "@/lib/venues";

const PAGE_SIZE = 12;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Props = {
  venues: Venue[];
  /** Hide the filters that the page itself already fixes (a region page or a category page). */
  lockRegion?: boolean;
  lockCategory?: boolean;
};

export default function Directory({ venues, lockRegion = false, lockCategory = false }: Props) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState<"" | Region>("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [q, category, region]);

  const categories = useMemo(() => [...new Set(venues.map((v) => v.category).filter(Boolean))].sort(), [venues]);

  const shown = venues.filter((v) => {
    if (category && v.category !== category) return false;
    if (region && v.region !== region) return false;
    if (!q) return true;
    return norm(`${v.name} ${v.category} ${v.town} ${v.neighbourhood} ${v.address} ${v.description}`).includes(norm(q));
  });

  const reset = () => {
    setQ("");
    setCategory("");
    setRegion("");
  };

  return (
    <section className="directory" id="places">
      {lockRegion ? null : (
        <div className="segment" role="group" aria-label="Area">
          {(["", ...Object.keys(REGIONS)] as ("" | Region)[]).map((r) => (
            <button key={r || "all"} type="button" aria-pressed={region === r} onClick={() => setRegion(r)}>
              {r ? REGIONS[r].name : "Everywhere"}
            </button>
          ))}
        </div>
      )}

      <input
        className="search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a name, street or craving"
        aria-label="Search places"
      />

      {lockCategory || categories.length < 2 ? null : (
        <div className="moods" role="group" aria-label="Type of place">
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(category === c ? "" : c)}>
              <span aria-hidden="true">{emojiFor(c)}</span> {c}
            </button>
          ))}
        </div>
      )}

      <p className="count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "place" : "places"}
      </p>

      {shown.length === 0 ? (
        <div className="empty">
          <p>Nothing matches that yet.</p>
          <button type="button" className="btn" onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <ul className="vlist">
            {shown.slice(0, visibleCount).map((v) => (
              <li key={v.slug}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
          {visibleCount < shown.length && (
            <button
              type="button"
              className="btn load-more"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show more ({shown.length - visibleCount} left)
            </button>
          )}
        </>
      )}
    </section>
  );
}
