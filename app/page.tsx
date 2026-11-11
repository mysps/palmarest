import Link from "next/link";
import Directory from "@/components/Directory";
import PostCard from "@/components/PostCard";
import Surprise from "@/components/Surprise";
import { REGIONS, type Region } from "@/lib/geo";
import { getPosts } from "@/lib/blog";
import { getVenues } from "@/lib/venues";

export default function Home() {
  const venues = getVenues();
  const posts = getPosts().slice(0, 3);
  const picks = venues.map((v) => ({
    slug: v.slug,
    name: v.name,
    category: v.category,
    where: v.region === "palma" ? v.neighbourhood || "Palma" : v.town,
  }));

  return (
    <>
      <section className="hero">
        <h1>
          Hungry in <span className="nowrap">Palma?</span>
        </h1>
        <p className="lede">
          {venues.length} hand-picked spots across Palma and the rest of Mallorca. Pick a mood, or let the dice decide.
        </p>
        <Surprise picks={picks} />
      </section>

      <div className="regions">
        {(Object.keys(REGIONS) as Region[]).map((r) => {
          const n = venues.filter((v) => v.region === r).length;
          return (
            <Link key={r} href={`/${r}/`} className={`region region-${r}`}>
              <span className="region-emoji" aria-hidden="true">
                {r === "palma" ? "🌆" : "⛰️"}
              </span>
              <span className="region-name">{REGIONS[r].name}</span>
              <span className="region-count">{n === 1 ? "1 place" : `${n} places`}</span>
            </Link>
          );
        })}
      </div>

      <h2>All the places</h2>
      <Directory venues={venues} />

      {posts.length ? (
        <section className="home-blog">
          <div className="row-head">
            <h2>Fresh from the blog</h2>
            <Link href="/blog/">All articles</Link>
          </div>
          <ul className="plist">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
