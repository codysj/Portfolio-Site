"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";
import { hillTop } from "@/lib/hillProfile";

/* ----------------------------- AsciiGrass -------------------------------- */
/* Grass in three depth bands (dim/short at back -> bright/tall at front) plus
   flowers clustered in patches, all riding the hill curve. */

export default function AsciiGrass({ bladeCount = 220, flowerCount = 38 }) {
  const bladeChars = ["|", "/", "\\", "^", "v", ",", "'", "i", "l"];
  const flowerChars = ["*", "o", "@", "+"];

  const { blades, flowers } = useMemo(() => {
    const rnd = mulberry32(99);

    // 0 = back band, 1 = mid, 2 = front band
    const band = (i) => (i < bladeCount * 0.4 ? 0 : i < bladeCount * 0.72 ? 1 : 2);
    const blades = Array.from({ length: bladeCount }, (_, i) => {
      const b = band(i);
      const t = rnd();                                   // scatter across width
      const lift = b === 0 ? 3.5 : b === 1 ? 1.5 : -1;   // front band sits lower/closer
      return {
        t,
        y: hillTop(t) + lift + (rnd() - 0.5) * 2,
        ch: bladeChars[(rnd() * bladeChars.length) | 0],
        size: (b === 0 ? 8 : b === 1 ? 11 : 15) + rnd() * 5,
        color: b === 2 ? "var(--ember-lit)" : b === 1 ? "var(--ember)" : "var(--ember-dim)",
        op: b === 2 ? 0.6 : b === 1 ? 0.42 : 0.26,
        gd: 3 + rnd() * 3,
        gdelay: -rnd() * 4,
      };
    });

    // flowers grouped into a handful of patches for a natural clustered look
    const patches = Array.from({ length: 7 }, () => 0.16 + rnd() * 0.78);
    const flowers = Array.from({ length: flowerCount }, () => {
      const t = Math.min(0.99, Math.max(0.04, patches[(rnd() * patches.length) | 0] + (rnd() - 0.5) * 0.16));
      const front = rnd() < 0.55;
      return {
        t,
        y: hillTop(t) + (front ? -1.5 : 2.5) + rnd() * 3,
        ch: flowerChars[(rnd() * flowerChars.length) | 0],
        size: (front ? 13 : 9) + rnd() * 7,
        gold: rnd() < 0.28,                              // light sprinkle of gold
        op: front ? 0.95 : 0.6,
        fd: 4 + rnd() * 3,
        fdelay: -rnd() * 5,
      };
    });
    return { blades, flowers };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bladeCount, flowerCount]);

  return (
    <div className="ah-grass" aria-hidden="true">
      {blades.map((b, i) => (
        <span key={i} className="gblade" style={{
          left: `${b.t * 100}%`,
          bottom: `${b.y}%`,
          fontSize: `${b.size}px`,
          color: b.color,
          opacity: b.op,
          "--gd": `${b.gd}s`,
          "--gdelay": `${b.gdelay}s`,
        }}>{b.ch}</span>
      ))}
      {flowers.map((f, i) => (
        <span key={`f${i}`} className="flower" style={{
          left: `${f.t * 100}%`,
          bottom: `${f.y}%`,
          fontSize: `${f.size}px`,
          color: f.gold ? "var(--amber)" : "var(--rose)",
          opacity: f.op,
          "--fd": `${f.fd}s`,
          "--fdelay": `${f.fdelay}s`,
        }}>{f.ch}</span>
      ))}
    </div>
  );
}
