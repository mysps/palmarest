"use client";

import { useEffect, useMemo, useState } from "react";
import VenueCard from "@/components/VenueCard";
import { useLang } from "@/lib/lang";
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
  const { t } = useLang();
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
        <div className="segment" role="group" aria-label={t.areaLabel}>
          {(["", ...Object.keys(REGIONS)] as ("" | Region)[]).map((r) => (
            <button key={r || "all"} type="button" aria-pressed={region === r} onClick={() => setRegion(r)}>
              {r ? REGIONS[r].name : t.everywhere}
            </button>
          ))}
        </div>
      )}

      <input
        className="search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchLabel}
      />

      {lockCategory || categories.length < 2 ? null : (
        <div className="moods" role="group" aria-label={t.typeLabel}>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(category === c ? "" : c)}>
              <span aria-hidden="true">{emojiFor(c)}</span> {t.categories[c] ?? c}
            </button>
          ))}
        </div>
      )}

      <p className="count" aria-live="polite">
        {shown.length} {shown.length === 1 ? t.placesSingular : t.placesPlural}
      </p>

      {shown.length === 0 ? (
        <div className="empty">
          <p>{t.noResults}</p>
          <button type="button" className="btn" onClick={reset}>
            {t.clearFilters}
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
              {t.showMore(shown.length - visibleCount)}
            </button>
          )}
        </>
      )}
    </section>
  );
}
