import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapView from "@/components/MapView";
import { REGIONS, toPins } from "@/lib/geo";
import { colourFor, emojiFor } from "@/lib/look";
import { getVenue, getVenues } from "@/lib/venues";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getVenues().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = getVenue((await params).slug);
  if (!v) return {};
  const where = v.neighbourhood || v.town || "Mallorca";
  const fullDesc = v.description
    ? `${v.description} Find ${v.category} in ${where}, Mallorca.`
    : `${v.name} — ${v.category} in ${v.town || "Mallorca"}.`;
  const title = `${v.name} | ${v.category} in ${v.town || "Mallorca"}`;
  return {
    title,
    description: fullDesc,
    alternates: { canonical: `/venue/${v.slug}/` },
    openGraph: {
      title,
      description: fullDesc,
      url: `/venue/${v.slug}/`,
      type: "website",
    },
  };
}

export default async function VenuePage({ params }: Props) {
  const v = getVenue((await params).slug);
  if (!v) notFound();
  const pins = toPins([v]);
  const where = v.address || [v.neighbourhood, v.town].filter(Boolean).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: v.name,
    description: v.description || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: v.address || undefined,
      addressLocality: v.town || undefined,
      addressRegion: "Illes Balears",
      addressCountry: "ES",
    },
    geo: v.lat != null && v.lng != null ? { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng } : undefined,
    sameAs: [v.instagramUrl],
  };

  return (
    <article className="venue">
      <div className={`venue-head bg-${colourFor(v.slug)}`}>
        <span className="venue-emoji" aria-hidden="true">
          {emojiFor(v.category)}
        </span>
        <h1>{v.name}</h1>
        <div className="tags">
          {v.categorySlug ? (
            <Link className="tag" href={`/category/${v.categorySlug}/`}>
              {v.category}
            </Link>
          ) : null}
          <Link className="tag" href={`/${v.region}/`}>
            {REGIONS[v.region].name}
          </Link>
        </div>
      </div>

      {v.description ? <p className="lede">{v.description}</p> : null}

      <div className="actions">
        <a className="btn btn-pink" href={v.mapsUrl} rel="noopener">
          <span aria-hidden="true">📍</span> Open in Google Maps
        </a>
        <a className="btn" href={v.instagramUrl} rel="noopener">
          <span aria-hidden="true">📸</span> @{v.handle}
        </a>
      </div>

      <dl className="facts">
        {where ? (
          <>
            <dt>Where</dt>
            <dd>{where}</dd>
          </>
        ) : null}
        <dt>Hours</dt>
        <dd>
          <a href={v.mapsUrl} rel="noopener">
            Check today&apos;s hours on Google Maps
          </a>
        </dd>
      </dl>

      {pins.length ? <MapView pins={pins} /> : null}

      {v.verifiedOn ? <p className="checked">Details last checked {v.verifiedOn}.</p> : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
