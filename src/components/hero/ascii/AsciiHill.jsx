"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";
import { hillTop } from "@/lib/hillProfile";

/* ------------------------------ AsciiHill -------------------------------- */
/* The rounded ground: a warm mass glow, a pooled glow under the tree, and a
   filled-in shrub texture (spaced clumps, depth-graded, gently breathing). */

export default function AsciiHill({ shrubCount = 240 }) {
  const shrubs = useMemo(() => {
    const rnd = mulberry32(303);
    const chars = ["@", "&", "%", "o", "8", "*", ":", ".", "·", "Q", "e"];
    return Array.from({ length: shrubCount }, () => {
      // denser toward the crest/right (under the tree), sparser at the edges
      const t = rnd() < 0.62 ? 0.45 + rnd() * 0.5 : rnd();
      const depth = rnd();                               // 0 back .. 1 front
      const lift = -1 + depth * 7;                       // front clumps sit lower/closer
      return {
        t,
        y: hillTop(t) - lift - rnd() * 4,
        ch: chars[(rnd() * chars.length) | 0],
        size: (5 + depth * 9) + rnd() * 3,
        color: depth > 0.7 ? "var(--ember-lit)" : depth > 0.4 ? "var(--ember)" : "var(--ember-dim)",
        op: 0.18 + depth * 0.42,
        breath: rnd() < 0.4,
        bd: 5 + rnd() * 5,
        bdl: -rnd() * 6,
      };
    });
  }, [shrubCount]);

  return (
    <div className="ah-hill" aria-hidden="true">
      <div className="ah-hill-mass" />
      {shrubs.map((s, i) => (
        <span key={i} className={s.breath ? "ah-shrub breath" : "ah-shrub"} style={{
          left: `${s.t * 100}%`,
          bottom: `${s.y}%`,
          fontSize: `${s.size}px`,
          color: s.color,
          opacity: s.breath ? undefined : s.op,
          "--bd": `${s.bd}s`,
          "--bdl": `${s.bdl}s`,
        }}>{s.ch}</span>
      ))}
    </div>
  );
}
