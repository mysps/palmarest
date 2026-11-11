"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { emojiFor } from "@/lib/look";

type Pick = { slug: string; name: string; category: string; where: string };

/** The dice: shuffles through names, then lands on one venue. */
export default function Surprise({ picks }: { picks: Pick[] }) {
  const { t } = useLang();
  const [current, setCurrent] = useState<Pick | null>(null);
  const [rolling, setRolling] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function roll() {
    if (!picks.length || rolling) return;
    const pool = picks.length > 1 && current ? picks.filter((p) => p.slug !== current.slug) : picks;
    const winner = pool[Math.floor(Math.random() * pool.length)];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(winner);
      return;
    }
    setRolling(true);
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks++;
      setCurrent(picks[Math.floor(Math.random() * picks.length)]);
      if (ticks >= 12) {
        if (timer.current) clearInterval(timer.current);
        setCurrent(winner);
        setRolling(false);
      }
    }, 70);
  }

  return (
    <div className="surprise">
      <button type="button" className="dice" onClick={roll} disabled={rolling}>
        <span className={rolling ? "dice-icon spin" : "dice-icon"} aria-hidden="true">
          🎲
        </span>
        {current ? t.surpriseMeAgain : t.surpriseMe}
      </button>

      <div aria-live="polite">
        {current ? (
          <div className={rolling ? "result rolling" : "result landed"}>
            <span className="result-emoji" aria-hidden="true">
              {emojiFor(current.category)}
            </span>
            <span className="result-text">
              <span className="result-label">{rolling ? t.rolling : t.youreGoingTo}</span>
              <span className="result-name">{current.name}</span>
              <span className="result-where">{[current.category, current.where].filter(Boolean).join(" in ")}</span>
            </span>
            {rolling ? null : (
              <Link href={`/venue/${current.slug}/`} className="btn btn-ink">
                {t.showMe}
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
