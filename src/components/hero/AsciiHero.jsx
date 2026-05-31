"use client";

import { useMemo, useEffect, useRef } from "react";

/*
  AsciiHero — a single-file CS portfolio hero with a procedural ASCII
  cherry-blossom landscape background.

  Component tree (matches spec):
    HeroPage
      ├─ AsciiHeroBackground
      │    ├─ AsciiTree        (recursive branch generator -> <pre> grid)
      │    ├─ AsciiGrass       (waving blades + pulsing base flowers)
      │    └─ FallingPetals    (lightweight canvas particle layer)
      └─ HeroContent           (eyebrow / headline / subhead / CTAs)

  Theming + animation live in one injected stylesheet (CSS variables +
  @keyframes) so the file drops cleanly into Next.js. Layout uses plain
  flex/grid. No external images, no animation libraries.
*/

/* ----------------------------- design tokens ----------------------------- */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap');

.ah-root{
  --bg-0:#070a09;
  --bg-1:#0b110e;
  --ink:#eceae2;
  --ink-dim:#98a39a;
  --branch:#5d564d;
  --bark:#cf8478;       /* glowing coral trunk + limbs */
  --bark-dim:#9c5f57;
  --rose:#d49aa6;       /* blossoms */
  --rose-soft:#f3cdd6;
  --ember:#a9744d;      /* warm hill grass */
  --ember-dim:#6f4a36;
  --ember-lit:#d39a6a;
  --sage:#82a78d;
  --sage-bright:#aacfb6;
  --amber:#dab57c;      /* gold flowers */
  --accent:#9ad3b0;

  --mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --serif:"Newsreader",Georgia,"Times New Roman",serif;

  position:relative;
  background:
    radial-gradient(120% 90% at 78% 8%, rgba(218,181,124,0.10), transparent 55%),
    radial-gradient(90% 80% at 12% 96%, rgba(130,167,141,0.08), transparent 60%),
    linear-gradient(180deg, var(--bg-1), var(--bg-0) 70%);
  color:var(--ink);
  font-family:var(--mono);
  overflow-x:hidden;
}
.ah-root *{box-sizing:border-box;}

/* ------- background scaffold ------- */
.ah-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
.ah-glow{position:absolute;border-radius:50%;filter:blur(40px);animation:ah-breathe 16s ease-in-out infinite;}
.ah-glow.moon{width:46vw;height:46vw;top:-8vw;right:-6vw;
  background:radial-gradient(circle, rgba(218,181,124,0.30), rgba(207,159,170,0.10) 45%, transparent 68%);}
.ah-glow.amb{width:38vw;height:38vw;bottom:-10vw;left:-8vw;animation-delay:-7s;
  background:radial-gradient(circle, rgba(130,167,141,0.18), transparent 65%);}

/* faint film grain for atmosphere */
.ah-grain{position:absolute;inset:0;opacity:0.05;mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* readability scrim: keeps the left-aligned copy crisp over the tree */
.ah-scrim{position:absolute;inset:0;
  background:
    linear-gradient(90deg, var(--bg-0) 2%, rgba(7,10,9,0.78) 28%, rgba(7,10,9,0.25) 58%, transparent 80%),
    linear-gradient(0deg, var(--bg-0) 1%, transparent 22%);}

/* ------- landscape (tree + hill), scoped to the landing section ------- */
/* anchored to the bottom of the hero; the bottom edge dissolves into the
   section below via a mask gradient. */
.ah-landscape{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;
  -webkit-mask-image:linear-gradient(to bottom,#000 70%,rgba(0,0,0,0.35) 88%,transparent 100%);
          mask-image:linear-gradient(to bottom,#000 70%,rgba(0,0,0,0.35) 88%,transparent 100%);}

/* local scrim so the left-aligned copy stays crisp without dimming the tree */
.ah-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    linear-gradient(90deg, var(--bg-0) 0%, rgba(7,10,9,0.62) 22%, rgba(7,10,9,0.18) 48%, transparent 64%),
    linear-gradient(180deg, transparent 58%, rgba(7,10,9,0.55) 100%);}

/* ------- ascii tree (planted on the hill crest, right of center) ------- */
.ah-tree-wrap{position:absolute;left:var(--tree-x,74%);bottom:var(--tree-y,25%);
  transform:translateX(-50%);}
.ah-tree-sway{display:block;transform-origin:50% 100%;animation:ah-sway 11s ease-in-out infinite;will-change:transform;}
.ah-tree{font-family:var(--mono);font-size:clamp(6px,1vw,11px);line-height:1;white-space:pre;}
.ah-row{display:block;height:1em;}
.t-trunk{color:var(--bark);opacity:.95;text-shadow:0 0 5px rgba(207,132,120,0.5);}
.t-limb{color:var(--bark);opacity:.85;text-shadow:0 0 5px rgba(207,132,120,0.4);}
.t-branch{color:var(--bark-dim);opacity:.7;}
.t-bl{color:var(--rose);}
.t-bl.near{color:var(--rose-soft);text-shadow:0 0 6px rgba(243,205,214,0.5);}
.t-bl.tw{animation:ah-twinkle var(--d,4s) ease-in-out infinite;}

/* ------- hill (warm filled ground: mass glow, shrub texture, pooled glow) ------- */
.ah-hill{position:absolute;inset:0;font-family:var(--mono);font-size:clamp(9px,1vw,13px);}
.ah-hill-mass{position:absolute;left:0;right:0;bottom:0;height:46%;
  background:
    radial-gradient(40% 80% at 73% 96%, rgba(216,150,108,0.30), rgba(207,120,96,0.10) 38%, transparent 66%),
    radial-gradient(70% 130% at 60% 100%, rgba(150,90,68,0.16), transparent 70%);}
.ah-shrub{position:absolute;transform:translateX(-50%);}
.ah-shrub.breath{animation:ah-breath var(--bd,6s) ease-in-out infinite;animation-delay:var(--bdl,0s);}

/* ------- grass + flowers (riding the hill curve, layered for depth) ------- */
.ah-grass{position:absolute;inset:0;font-family:var(--mono);}
.gblade{position:absolute;display:inline-block;transform-origin:50% 100%;
  animation:ah-gwave var(--gd,4s) ease-in-out infinite;animation-delay:var(--gdelay,0s);will-change:transform;}
.flower{position:absolute;display:inline-block;transform-origin:50% 100%;
  animation:ah-fpulse var(--fd,5s) ease-in-out infinite;animation-delay:var(--fdelay,0s);
  text-shadow:0 0 8px currentColor;}

/* ------- petals canvas ------- */
.ah-petals{position:absolute;inset:0;width:100%;height:100%;}

/* ------- content ------- */
.ah-hero{position:relative;z-index:3;min-height:100svh;display:flex;flex-direction:column;
  justify-content:center;padding:clamp(24px,7vw,120px);overflow:hidden;}
.ah-eyebrow,.ah-h1,.ah-sub,.ah-cta{position:relative;z-index:2;}
.ah-topbar,.ah-scroll{z-index:2;}
.ah-topbar{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;
  padding:clamp(18px,3vw,30px) clamp(24px,7vw,120px);font-size:12px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ink-dim);}
.ah-topbar .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);
  margin-right:8px;box-shadow:0 0 10px var(--accent);vertical-align:middle;}
.ah-eyebrow{font-size:clamp(11px,1.1vw,13px);letter-spacing:.32em;text-transform:uppercase;color:var(--sage-bright);
  margin-bottom:clamp(18px,2.5vw,30px);}
.ah-eyebrow .sep{color:var(--branch);margin:0 .55em;}
.ah-h1{font-family:var(--serif);font-weight:300;letter-spacing:-0.015em;line-height:1.03;
  font-size:clamp(2.3rem,6.2vw,5.2rem);max-width:16ch;margin:0;}
.ah-h1 em{font-style:italic;color:var(--rose-soft);}
.ah-sub{margin:clamp(22px,2.8vw,34px) 0 0;max-width:58ch;color:var(--ink-dim);
  font-size:clamp(.92rem,1.15vw,1.06rem);line-height:1.75;}
.ah-cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:clamp(30px,3.6vw,46px);}
.ah-btn{font-family:var(--mono);font-size:13px;letter-spacing:.12em;text-transform:uppercase;
  padding:14px 26px;border-radius:2px;cursor:pointer;transition:all .25s ease;
  display:inline-flex;align-items:center;gap:10px;text-decoration:none;}
.ah-btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}
.ah-btn-primary{background:rgba(154,211,176,0.12);color:var(--sage-bright);
  border:1px solid rgba(154,211,176,0.45);}
.ah-btn-primary:hover{background:rgba(154,211,176,0.2);border-color:var(--accent);
  box-shadow:0 0 26px rgba(154,211,176,0.22);transform:translateY(-1px);}
.ah-btn-ghost{background:transparent;color:var(--ink-dim);border:1px solid rgba(236,234,226,0.16);}
.ah-btn-ghost:hover{color:var(--ink);border-color:rgba(236,234,226,0.4);transform:translateY(-1px);}
.ah-arrow{transition:transform .25s ease;}
.ah-btn:hover .ah-arrow{transform:translateX(3px);}

.ah-scroll{position:absolute;bottom:clamp(20px,3vh,34px);left:clamp(24px,7vw,120px);
  font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--ink-dim);
  display:flex;align-items:center;gap:10px;}
.ah-scroll .bar{display:block;width:1px;height:30px;background:linear-gradient(var(--sage),transparent);
  animation:ah-drop 2.4s ease-in-out infinite;}

/* ------- placeholder sections ------- */
.ah-section{position:relative;z-index:3;padding:clamp(70px,10vw,150px) clamp(24px,7vw,120px);}
.ah-section-tag{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--sage);margin-bottom:26px;}
.ah-section h2{font-family:var(--serif);font-weight:300;font-size:clamp(1.9rem,4vw,3rem);margin:0 0 14px;}
.ah-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:42px;}
.ah-card{border:1px solid rgba(236,234,226,0.1);border-radius:3px;padding:26px;background:rgba(255,255,255,0.012);
  transition:border-color .25s ease,transform .25s ease;}
.ah-card:hover{border-color:rgba(154,211,176,0.4);transform:translateY(-3px);}
.ah-card .idx{color:var(--sage);font-size:12px;letter-spacing:.2em;}
.ah-card h3{font-family:var(--serif);font-weight:400;font-size:1.35rem;margin:14px 0 10px;}
.ah-card p{color:var(--ink-dim);font-size:.9rem;line-height:1.7;margin:0;}
.ah-about p{color:var(--ink-dim);max-width:62ch;line-height:1.85;font-size:1.02rem;}
.ah-foot{position:relative;z-index:3;padding:40px clamp(24px,7vw,120px);border-top:1px solid rgba(236,234,226,0.08);
  color:var(--branch);font-size:12px;letter-spacing:.16em;text-transform:uppercase;}

/* ------- entrance reveal ------- */
.reveal{opacity:0;animation:ah-fadeup .9s cubic-bezier(.2,.7,.2,1) forwards;}

/* ------- keyframes ------- */
@keyframes ah-sway{0%,100%{transform:rotate(-0.45deg)}50%{transform:rotate(0.6deg)}}
@keyframes ah-twinkle{0%,100%{opacity:.4}50%{opacity:.95}}
@keyframes ah-gwave{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes ah-fpulse{0%,100%{opacity:.45;transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}}
@keyframes ah-breathe{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes ah-breath{0%,100%{opacity:.32}50%{opacity:.7}}
@keyframes ah-fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes ah-drop{0%{transform:scaleY(.2);opacity:.3;transform-origin:top}50%{transform:scaleY(1);opacity:1}100%{transform:scaleY(.2);opacity:.3;transform-origin:bottom}}

/* ------- responsive: push the scene right so copy breathes ------- */
@media (max-width:900px){
  .ah-tree-wrap{--tree-x:76%;opacity:.72;}
  .ah-hero-scrim{background:
    linear-gradient(90deg, var(--bg-0) 0%, rgba(7,10,9,0.55) 30%, transparent 70%),
    linear-gradient(180deg, transparent 52%, rgba(7,10,9,0.6) 100%);}
}
@media (max-width:560px){
  .ah-tree-wrap{--tree-x:84%;--tree-y:24%;opacity:.5;}
  .ah-hill-mass{background:radial-gradient(70% 130% at 80% 100%, rgba(130,167,141,0.12), transparent 70%);}
}

/* ------- reduced motion: kill all ambient movement ------- */
@media (prefers-reduced-motion:reduce){
  .ah-tree-sway,.t-bl,.gblade,.flower,.ah-shrub,.ah-glow,.ah-scroll .bar{animation:none!important;}
  .reveal{animation:none!important;opacity:1!important;transform:none!important;}
}
`;

/* ------------------------- deterministic generator ------------------------ */

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Shared hill profile: percentage height (from the bottom of the landscape
   box) of the ground surface at horizontal position t in [0,1]. A broad
   gaussian hump crests right-of-center so the tree sits on it while the
   left stays open for the copy. */
const HILL = { peak: 0.7, sigma: 0.32, base: 12, crest: 30 };
function hillTop(t) {
  const bump = Math.exp(-((t - HILL.peak) ** 2) / (2 * HILL.sigma ** 2));
  return HILL.base + (HILL.crest - HILL.base) * bump;
}

/* Grows a weeping cherry into a character grid.
   - lower trunk is bare and curved
   - branches fan UPWARD only (clamped to the upper hemisphere)
   - blossoms hang from the branches in drooping, tapering strands with
     front/back depth so the canopy reads as a lacy cloud, not a block.
   Returns rows[y][x] = null | {ch, type, depth, near, tw, d}. */
function growTree({ cols, rows, seed }) {
  const rnd = mulberry32(seed);
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(null));
  const inb = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows;
  const bloomNear = ["@", "*", "o", "8", "&"];     // bright, foreground
  const bloomFar = [".", "·", "'", '"', ",", ":"];  // dim, receding

  const put = (x, y, ch, type, extra) => {
    x = Math.round(x); y = Math.round(y);
    if (!inb(x, y)) return;
    const cur = grid[y][x];
    if (cur && cur.type === "blossom" && type !== "blossom") return; // blossoms win
    if (cur && cur.type === "blossom" && type === "blossom" && cur.depth > (extra?.depth ?? 0)) return; // keep nearer
    grid[y][x] = { ch, type, ...extra };
  };

  const bloom = (x, y, depth) => {
    const near = depth > 0.55;
    const set = near ? bloomNear : bloomFar;
    put(x, y, set[(rnd() * set.length) | 0], "blossom", {
      depth, near, tw: rnd() < 0.6, d: 3 + rnd() * 4.5,
    });
  };

  // a drooping strand of blossoms hanging down from (x,y)
  const drape = (x, y, len, depth) => {
    const w = 1.6;
    for (let i = 0; i < len; i++) {
      const frac = i / len;
      const dens = 0.92 * (1 - frac) + 0.1;          // thins toward the tip
      const halfw = Math.max(0, w * (1 - frac * 0.85));
      for (let dx = -halfw; dx <= halfw; dx += 1) {
        if (rnd() < dens) bloom(x + dx + (rnd() - 0.5), y + i, depth * (0.8 + rnd() * 0.35));
      }
      if (halfw < 0.6 && rnd() < 0.5) bloom(x + (rnd() - 0.5), y + i, depth * 0.7); // trailing tip
    }
  };

  // recursive branch walk, upper hemisphere only; collects drape anchors
  const anchors = [];
  const branch = (x, y, angle, len, depth) => {
    const steps = Math.max(2, Math.round(len));
    const dx = Math.cos(angle), dy = -Math.sin(angle);
    let cx = x, cy = y;
    for (let i = 0; i < steps; i++) {
      cx += dx; cy += dy;
      let ch = "|";
      if (dx > 0.3) ch = "/"; else if (dx < -0.3) ch = "\\";
      put(cx, cy, ch, depth >= 3 ? "limb" : "branch");
      if (depth <= 2 && rnd() < 0.3) anchors.push([cx, cy, depth]); // mid-twig anchors
    }
    anchors.push([cx, cy, depth]);                    // tip anchor
    if (depth <= 0) return;
    const kids = 2 + (rnd() < 0.6 ? 1 : 0);
    const open = depth >= 3 ? 0.5 : 0.62;
    for (let k = 0; k < kids; k++) {
      const t = kids === 1 ? 0 : k / (kids - 1) - 0.5;
      let na = angle + t * open * 2 + (rnd() - 0.5) * 0.3;
      na = Math.max(0.4, Math.min(Math.PI - 0.4, na));  // never droop below horizontal
      branch(cx, cy, na, len * (0.64 + rnd() * 0.12), depth - 1);
    }
  };

  // trunk: bare, curving up roughly half the height
  let tx = cols * 0.54;
  let ty = rows - 1;
  const trunkLen = Math.round(rows * 0.48);
  for (let i = 0; i < trunkLen; i++) {
    const frac = i / trunkLen;
    put(tx, ty, "|", "trunk");
    if (frac < 0.55) {                                 // thicker near the base
      put(tx - 1, ty, i % 4 === 0 ? "(" : "|", "trunk");
      put(tx + 1, ty, i % 4 === 0 ? ")" : "|", "trunk");
    }
    ty -= 1;
    tx += (frac < 0.5 ? 0.16 : -0.12) + (rnd() - 0.5) * 0.18;  // gentle S-curve
  }

  // canopy scaffold: a fan of limbs into the upper hemisphere, biased up-left
  const baseAngles = [0.32, 0.46, 0.55, 0.66, 0.78, 0.9].map((p) => p * Math.PI);
  for (const a of baseAngles) branch(tx, ty + ((rnd() * 2) | 0), a, rows * 0.2, 4);

  // hang drapes from the anchors; canopy bottom stays above this floor
  const floorY = rows * 0.6;
  for (const [ax, ay, d] of anchors) {
    const depth = 0.25 + rnd() * 0.75 - d * 0.05;      // deeper twigs read nearer
    let len = 3 + rnd() * 9;
    len = Math.min(len, floorY - ay);
    if (len < 2) len = 2;
    drape(ax, ay, Math.round(len), Math.max(0.15, Math.min(1, depth)));
  }

  // a few extra fill drapes across the canopy top for fullness
  for (let i = 0; i < 16; i++) {
    const ax = tx + (rnd() - 0.55) * cols * 0.34;
    const ay = ty - rnd() * rows * 0.16;
    drape(ax, ay, 3 + ((rnd() * 6) | 0), 0.3 + rnd() * 0.6);
  }

  return grid;
}

/* ------------------------------ AsciiTree -------------------------------- */

function AsciiTree({ cols = 66, rows = 50, seed = 11 }) {
  const grid = useMemo(() => growTree({ cols, rows, seed }), [cols, rows, seed]);
  const cls = (t) => (t === "trunk" ? "t-trunk" : t === "limb" ? "t-limb" : "t-branch");

  const lines = grid.map((row, y) => {
    const out = [];
    let buf = "", bufType = null, key = 0;
    const flush = () => {
      if (!buf) return;
      if (bufType === "space") out.push(buf);
      else out.push(<span key={`${y}-${key++}`} className={cls(bufType)}>{buf}</span>);
      buf = "";
    };
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (!cell) {
        if (bufType !== "space") { flush(); bufType = "space"; }
        buf += " ";
      } else if (cell.type === "blossom") {
        flush(); bufType = null;
        const op = (0.35 + cell.depth * 0.6).toFixed(2);
        out.push(
          <span key={`${y}-${key++}`}
            className={`t-bl${cell.near ? " near" : ""}${cell.tw ? " tw" : ""}`}
            style={{ opacity: op, ...(cell.tw ? { "--d": `${cell.d}s` } : {}) }}>
            {cell.ch}
          </span>
        );
      } else {
        if (bufType !== cell.type) { flush(); bufType = cell.type; }
        buf += cell.ch;
      }
    }
    flush();
    return <span key={y} className="ah-row">{out}</span>;
  });

  return (
    <div className="ah-tree-wrap">
      <div className="ah-tree-sway">
        <div className="ah-tree">{lines}</div>
      </div>
    </div>
  );
}

/* ----------------------------- AsciiGrass -------------------------------- */
/* Grass in three depth bands (dim/short at back -> bright/tall at front) plus
   flowers clustered in patches, all riding the hill curve. */

function AsciiGrass({ bladeCount = 220, flowerCount = 38 }) {
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

/* ------------------------------ AsciiHill -------------------------------- */
/* The rounded ground: a warm mass glow, a pooled glow under the tree, and a
   filled-in shrub texture (spaced clumps, depth-graded, gently breathing). */

function AsciiHill({ shrubCount = 240 }) {
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

/* ---------------------------- AsciiLandscape ----------------------------- */
/* Composes hill + tree + grass and dissolves its bottom edge into the
   section beneath the hero (mask applied in CSS). */

function AsciiLandscape() {
  return (
    <div className="ah-landscape" aria-hidden="true">
      <AsciiHill />
      <AsciiTree />
      <AsciiGrass />
    </div>
  );
}

/* ---------------------------- FallingPetals ------------------------------ */
/* Canvas particle layer: petals drift from the upper-right toward the
   lower-left with a gentle sine sway. One rAF loop, respawns on exit. */

function FallingPetals() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1, raf = 0;
    const chars = ["'", "·", ".", "*"];
    const tint = ["207,159,170", "236,201,209", "200,150,140"];
    let parts = [];

    const makePart = (top) => {
      const r = Math.random;
      return {
        x: w * (0.18 + r() * 0.95),
        y: top ? -10 : r() * h,
        ch: chars[(r() * chars.length) | 0],
        col: tint[(r() * tint.length) | 0],
        size: 9 + r() * 9,
        a: 0.25 + r() * 0.5,
        vy: 0.25 + r() * 0.55,
        vx: -(0.12 + r() * 0.42),
        phase: r() * Math.PI * 2,
        freq: 0.6 + r() * 0.9,
        amp: 0.25 + r() * 0.7,
      };
    };

    const resize = () => {
      w = canvas.parentElement.clientWidth;
      h = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = w < 640 ? Math.floor(w / 30) : Math.min(80, Math.floor(w / 16));
      parts = Array.from({ length: target }, () => makePart(false));
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      // static, sparse scatter — no animation loop
      parts.slice(0, Math.min(24, parts.length)).forEach((p) => {
        ctx.font = `${p.size}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(${p.col},${p.a})`;
        ctx.fillText(p.ch, p.x, p.y < 0 ? Math.random() * h : p.y);
      });
      return () => window.removeEventListener("resize", resize);
    }

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;
      for (const p of parts) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.freq + p.phase) * p.amp * 0.4;
        if (p.y > h + 12 || p.x < -12) Object.assign(p, makePart(true));
        const flicker = 0.75 + 0.25 * Math.sin(time * 1.5 + p.phase);
        ctx.font = `${p.size}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(${p.col},${p.a * flicker})`;
        ctx.fillText(p.ch, p.x, p.y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="ah-petals" aria-hidden="true" />;
}

/* -------------------------- AsciiHeroBackground -------------------------- */

function AsciiHeroBackground() {
  return (
    <div className="ah-bg" aria-hidden="true">
      <div className="ah-glow moon" />
      <div className="ah-glow amb" />
      <FallingPetals />
      <div className="ah-grain" />
      <div className="ah-scrim" />
    </div>
  );
}

/* ------------------------------ HeroContent ------------------------------ */

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function HeroContent() {
  return (
    <header className="ah-hero">
      <AsciiLandscape />
      <div className="ah-hero-scrim" aria-hidden="true" />

      <div className="ah-topbar reveal" style={{ animationDelay: ".05s" }}>
        <span>Cody&nbsp;J. — CS Portfolio</span>
        <span><span className="dot" />Open to work</span>
      </div>

      <p className="ah-eyebrow reveal" style={{ animationDelay: ".15s" }}>
        CS Portfolio<span className="sep">/</span>AI Systems<span className="sep">/</span>Quant Engineering
      </p>

      <h1 className="ah-h1 reveal" style={{ animationDelay: ".28s" }}>
        Building software at the <em>edge</em> of AI, markets, and systems.
      </h1>

      <p className="ah-sub reveal" style={{ animationDelay: ".42s" }}>
        Computer science portfolio featuring full-stack systems, AI-assisted research tools,
        and quantitative engineering projects.
      </p>

      <div className="ah-cta reveal" style={{ animationDelay: ".56s" }}>
        <button className="ah-btn ah-btn-primary" onClick={() => scrollTo("projects")}>
          View Projects <span className="ah-arrow">→</span>
        </button>
        <button className="ah-btn ah-btn-ghost" onClick={() => scrollTo("about")}>
          About Me
        </button>
      </div>

      <div className="ah-scroll reveal" style={{ animationDelay: ".8s" }}>
        <span className="bar" /> Scroll
      </div>
    </header>
  );
}

/* ----------------------------- placeholders ------------------------------ */

const PROJECTS = [
  { idx: "01", title: "Orderbook Simulator", desc: "A low-latency matching engine and market-microstructure sandbox for testing execution strategies." },
  { idx: "02", title: "Research Copilot", desc: "Retrieval-augmented tooling that turns scattered papers and notes into a queryable knowledge base." },
  { idx: "03", title: "Signal Pipeline", desc: "A streaming feature store and backtesting harness for systematic, data-driven trading research." },
];

function Placeholders() {
  return (
    <>
      <section id="projects" className="ah-section">
        <p className="ah-section-tag">Selected Work</p>
        <h2>Projects</h2>
        <div className="ah-grid">
          {PROJECTS.map((p) => (
            <article className="ah-card" key={p.idx}>
              <span className="idx">{p.idx}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="ah-section ah-about">
        <p className="ah-section-tag">Profile</p>
        <h2>About</h2>
        <p>
          I build at the intersection of systems engineering, machine learning, and quantitative
          finance — favoring tools that are fast, legible, and honest about their assumptions.
          This is placeholder copy you can replace with your own story.
        </p>
      </section>

      <footer className="ah-foot">© 2026 Cody J. — Built with React &amp; ASCII.</footer>
    </>
  );
}

/* -------------------------------- HeroPage ------------------------------- */

export default function HeroPage() {
  return (
    <div className="ah-root">
      {/* TODO: Move the generated hero CSS into src/app/globals.css or a dedicated hero stylesheet during the next refactor. */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <AsciiHeroBackground />
      <HeroContent />
      <Placeholders />
    </div>
  );
}
