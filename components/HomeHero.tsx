"use client";

import Link from "next/link";
import Surprise from "@/components/Surprise";
import { useLang } from "@/lib/lang";
import { REGIONS, type Region } from "@/lib/geo";

type Pick = { slug: string; name: string; category: string; where: string };

export default function HomeHero({
  venueCount,
  picks,
  regions,
}: {
  venueCount: number;
  picks: Pick[];
  regions: { key: Region; name: string; count: number }[];
}) {
  const { t } = useLang();
  return (
    <>
      <section className="hero">
        <h1>{t.heroHeading(venueCount)}</h1>
        <p className="lede">{t.heroLede(venueCount)}</p>
        <Surprise picks={picks} />
      </section>
      <div className="regions">
        {regions.map((r) => (
          <Link key={r.key} href={`/${r.key}/`} className={`region region-${r.key}`}>
            <span className="region-emoji" aria-hidden="true">
              {r.key === "palma" ? "🌆" : "⛰️"}
            </span>
            <span className="region-name">{r.name}</span>
            <span className="region-count">{t.regionPlaces(r.count)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
