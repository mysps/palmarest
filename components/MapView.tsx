"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MALLORCA_BOUNDS, REGIONS, type Pin, type Region } from "@/lib/geo";

const COLOURS: Record<Region, string> = { palma: "#ff2e88", mallorca: "#2fd6d0" };

type Props = {
  pins: Pin[];
  /** "island" always frames the whole of Mallorca; "pins" zooms to the venues shown. */
  fit?: "island" | "pins";
  /** Show the Palma / Rest of Mallorca toggles. */
  toggles?: boolean;
  tall?: boolean;
};

export default function MapView({ pins, fit = "pins", toggles = false, tall = false }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Record<Region, boolean>>({ palma: true, mallorca: true });
  const visible = pins.filter((p) => shown[p.region]);
  const anyApprox = visible.some((p) => p.approx);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    import("leaflet").then(({ default: L }) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      for (const p of visible) {
        const box = document.createElement("div");
        const link = document.createElement("a");
        link.href = `/venue/${p.slug}/`;
        link.textContent = p.name;
        link.className = "pin-name";
        const meta = document.createElement("div");
        meta.textContent = p.approx ? `${p.label} (approximate location)` : p.label;
        box.append(link, meta);
        L.circleMarker([p.lat, p.lng], {
          radius: 9, weight: 2.5, color: "#1b1464", fillColor: COLOURS[p.region], fillOpacity: 1,
        }).bindPopup(box).addTo(map);
      }

      if (fit === "island" || visible.length === 0) map.fitBounds(MALLORCA_BOUNDS);
      else if (visible.length === 1) map.setView([visible[0].lat, visible[0].lng], visible[0].approx ? 14 : 16);
      else map.fitBounds(L.latLngBounds(visible.map((p) => [p.lat, p.lng])).pad(0.25), { maxZoom: 15 });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, fit, shown.palma, shown.mallorca]);

  return (
    <div className="mapwrap">
      {toggles ? (
        <div className="legend">
          {(Object.keys(REGIONS) as Region[]).map((r) => (
            <label key={r}>
              <input
                type="checkbox"
                checked={shown[r]}
                onChange={(e) => setShown((s) => ({ ...s, [r]: e.target.checked }))}
              />
              <span className="dot" style={{ background: COLOURS[r] }} />
              {REGIONS[r].name} ({pins.filter((p) => p.region === r).length})
            </label>
          ))}
        </div>
      ) : null}
      <div ref={el} className={tall ? "map tall" : "map"} role="region" aria-label="Map of venues" />
      {anyApprox ? <p className="map-note">Some pins show the neighbourhood or town, not the exact door.</p> : null}
    </div>
  );
}
