"use client";

import { useMemo } from "react";
import { growTree } from "@/lib/growTree";

/* ------------------------------ AsciiTree -------------------------------- */

/* PERFORMANCE NOTE
   The previous renderer emitted one <span> per blossom CHARACTER (thousands of
   DOM nodes) and attached a CSS keyframe animation to ~half of them (thousands
   of simultaneous animations) — that was the cause of the severe render/preview
   lag, not the generation (which is memoized).

   This renderer instead flattens the grid into a SMALL, FIXED set of full-grid
   ASCII layers (5 <pre> text nodes total). Each cell belongs to exactly one
   layer, so the layers are disjoint and simply stack to reproduce the image.
   Colour/opacity is per-layer (CSS), and only ONE layer animates (a single
   subtle shimmer), so the DOM and animation cost are both ~O(1). */
export default function AsciiTree({ cols = 140, rows = 82, seed = 11 }) {
  const layers = useMemo(() => {
    const grid = growTree({ cols, rows, seed });
    const bark = [], branch = [], far = [], mid = [], near = [];
    for (let y = 0; y < rows; y++) {
      const row = grid[y];
      let b = "", br = "", f = "", m = "", n = "";
      for (let x = 0; x < cols; x++) {
        const c = row[x];
        if (!c) { b += " "; br += " "; f += " "; m += " "; n += " "; continue; }
        if (c.type === "blossom") {
          const t = c.tier;
          f += t === "far" ? c.ch : " ";
          m += t === "mid" ? c.ch : " ";
          n += t === "near" ? c.ch : " ";
          b += " "; br += " ";
        } else if (c.type === "branch") {
          br += c.ch; b += " "; f += " "; m += " "; n += " ";
        } else {                              // trunk + primary limbs
          b += c.ch; br += " "; f += " "; m += " "; n += " ";
        }
      }
      bark.push(b); branch.push(br); far.push(f); mid.push(m); near.push(n);
    }
    return {
      bark: bark.join("\n"), branch: branch.join("\n"), far: far.join("\n"),
      mid: mid.join("\n"), near: near.join("\n"),
    };
  }, [cols, rows, seed]);

  return (
    <div className="ah-tree-wrap">
      <div className="ah-tree-glow" aria-hidden="true" />
      <div className="ah-tree-sway">
        <div className="ah-tree" aria-hidden="true">
          {/* disjoint ASCII layers — 5 text nodes instead of ~4000 spans */}
          <pre className="ah-tl far">{layers.far}</pre>
          <pre className="ah-tl branch">{layers.branch}</pre>
          <pre className="ah-tl bark">{layers.bark}</pre>
          <pre className="ah-tl mid">{layers.mid}</pre>
          <pre className="ah-tl near">{layers.near}</pre>
        </div>
      </div>
    </div>
  );
}
