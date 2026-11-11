import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RegionContent from "@/components/RegionContent";
import { REGIONS, type Region } from "@/lib/geo";
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
    <RegionContent
      region={region}
      name={info.name}
      intro={info.intro}
      venues={venues}
    />
  );
}
