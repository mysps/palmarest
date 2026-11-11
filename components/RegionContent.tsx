"use client";

import Directory from "@/components/Directory";
import MapView from "@/components/MapView";
import { useLang } from "@/lib/lang";
import { toPins, type Region } from "@/lib/geo";
import type { Venue } from "@/lib/venues";

export default function RegionContent({
  region,
  name,
  intro,
  venues,
}: {
  region: Region;
  name: string;
  intro: string;
  venues: Venue[];
}) {
  const { t } = useLang();
  return (
    <>
      <section className={`hero hero-small hero-${region}`}>
        <h1>{name}</h1>
        <p className="lede">{intro}</p>
      </section>
      {venues.length ? (
        <>
          <Directory venues={venues} lockRegion />
          <h2>{t.onTheMap}</h2>
          <MapView pins={toPins(venues)} fit={region === "mallorca" ? "island" : "pins"} />
        </>
      ) : (
        <div className="empty">
          <p>{t.nothingHereYet}</p>
        </div>
      )}
    </>
  );
}
