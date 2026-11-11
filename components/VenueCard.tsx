"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { colourFor, emojiFor } from "@/lib/look";
import type { Venue } from "@/lib/venues";

export default function VenueCard({ venue: v }: { venue: Venue }) {
  const { lang } = useLang();
  const place = v.region === "palma" ? v.neighbourhood || "Palma" : v.town;
  const desc = lang === "es" && v.description_es ? v.description_es : v.description;
  return (
    <Link href={`/venue/${v.slug}/`} className="vcard">
      <span className={`vtile bg-${colourFor(v.slug)}`} aria-hidden="true">
        {emojiFor(v.category)}
      </span>
      <span className="vbody">
        <span className="vname">{v.name}</span>
        <span className="vdesc">{desc}</span>
        <span className="tags">
          {v.category ? <span className="tag">{v.category}</span> : null}
          {place ? <span className={`tag ${v.region === "palma" ? "tag-palma" : "tag-island"}`}>{place}</span> : null}
        </span>
      </span>
    </Link>
  );
}
