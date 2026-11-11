import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Directory from "@/components/Directory";
import MapView from "@/components/MapView";
import { REGIONS, toPins, type Region } from "@/lib/geo";
import { getVenues } from "@/lib/venues";

type Props = { params: Promise<{ region: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(REGIONS).map((region) => ({ region }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = REGIONS[(await params).region as Region];
  return info ? { title: info.heading, description: info.intro } : {};
}

export default async function RegionPage({ params }: Props) {
  const region = (await params).region as Region;
  const info = REGIONS[region];
  if (!info) notFound();
  const venues = getVenues().filter((v) => v.region === region);

  return (
    <>
      <section className={`hero hero-small hero-${region}`}>
        <h1>{info.name}</h1>
        <p className="lede">{info.intro}</p>
      </section>
      {venues.length ? (
        <>
          <Directory venues={venues} lockRegion />
          <h2>On the map</h2>
          <MapView pins={toPins(venues)} fit={region === "mallorca" ? "island" : "pins"} />
        </>
      ) : (
        <div className="empty">
          <p>Nothing here yet. New places are added as they are checked.</p>
        </div>
      )}
    </>
  );
}
