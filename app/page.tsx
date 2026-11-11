import Directory from "@/components/Directory";
import HomeBlogRow from "@/components/HomeBlogRow";
import HomeHero from "@/components/HomeHero";
import HomeAllPlaces from "@/components/HomeAllPlaces";
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
  const regions = (Object.keys(REGIONS) as Region[]).map((r) => ({
    key: r,
    name: REGIONS[r].name,
    count: venues.filter((v) => v.region === r).length,
  }));

  return (
    <>
      <HomeHero venueCount={venues.length} picks={picks} regions={regions} />
      <HomeAllPlaces />
      <Directory venues={venues} />
      <HomeBlogRow posts={posts} />
    </>
  );
}
