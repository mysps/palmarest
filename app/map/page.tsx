import type { Metadata } from "next";
import MapView from "@/components/MapView";
import { toPins } from "@/lib/geo";
import { getVenues } from "@/lib/venues";

export const metadata: Metadata = {
  title: "Map of Mallorca",
  description: "Every listed restaurant, bar and café on one map of Mallorca.",
};

export default function MapPage() {
  return (
    <>
      <section className="hero hero-small">
        <h1>The map</h1>
        <p className="lede">Tap a pin to open the place. Pink is Palma, turquoise is the rest of the island.</p>
      </section>
      <MapView pins={toPins(getVenues())} fit="island" toggles tall />
    </>
  );
}
