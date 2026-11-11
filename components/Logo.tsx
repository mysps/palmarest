"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";

export default function Logo() {
  const { t } = useLang();
  return (
    <Link href="/" className="logo">
      {t.siteName}
    </Link>
  );
}
