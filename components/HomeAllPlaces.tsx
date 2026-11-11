"use client";

import { useLang } from "@/lib/lang";

export default function HomeAllPlaces() {
  const { t } = useLang();
  return <h2>{t.allPlaces}</h2>;
}
