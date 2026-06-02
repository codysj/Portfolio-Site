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
.ah-tree-wrap{position:absolute;left:var(--tree-x,73%);bottom:var(--tree-y,25%);
  transform:translateX(-50%);}
/* faint, contained warm glow anchoring the trunk base into the particle field —
   sits behind the text, stays put while the tree sways; not a spotlight/halo. */
.ah-tree-glow{position:absolute;left:47%;bottom:0;width:30%;height:13%;
  transform:translate(-50%,40%);pointer-events:none;z-index:0;
  background:radial-gradient(50% 50% at 50% 50%,
    rgba(207,132,120,0.15),rgba(201,120,96,0.06) 45%,transparent 72%);
  filter:blur(5px);mix-blend-mode:screen;}
.ah-tree-sway{position:relative;z-index:1;display:block;transform-origin:50% 100%;animation:ah-sway 11s ease-in-out infinite;will-change:transform;}
/* font scales with BOTH width and height (min) so the tall crown — which keeps
   empty headroom rows above it — always fits the viewport without clipping.
   The tree is drawn as a few stacked, full-grid ASCII layers (see AsciiTree). */
.ah-tree{position:relative;font-family:var(--mono);font-size:clamp(5px,min(0.8vw,0.95vh),10px);line-height:1;letter-spacing:-0.02em;}
.ah-tl{margin:0;font:inherit;white-space:pre;position:absolute;top:0;left:0;}
.ah-tl:first-child{position:relative;}   /* first layer establishes the box size */
.ah-tl.far{color:var(--bark-dim);opacity:.5;}                                   /* dim receding background */
.ah-tl.branch{color:var(--bark-dim);opacity:.72;text-shadow:0 0 4px rgba(156,95,87,0.4);}
.ah-tl.bark{color:var(--bark);opacity:.96;text-shadow:0 0 6px rgba(207,132,120,0.55);}
.ah-tl.mid{color:var(--rose);opacity:.9;}                                        /* middle canopy mass */
.ah-tl.near{color:var(--rose-soft);text-shadow:0 0 7px rgba(243,205,214,0.55);  /* bright foreground */
  animation:ah-twinkle 6.5s ease-in-out infinite;}                              /* ONE subtle shimmer node */

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
@keyframes ah-twinkle{0%,100%{opacity:.82}50%{opacity:1}}
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
  .ah-tree-sway,.ah-tl,.gblade,.flower,.ah-shrub,.ah-glow,.ah-scroll .bar{animation:none!important;}
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

/* Grows a large weeping cherry into a character grid.

   The silhouette is composed (not a lollipop) so structure reads through:
     1. an S-curved, bark-textured trunk that tapers as it rises and, crucially,
        CONTINUES as a visible central leader up into the crown before forking;
     2. asymmetric primary limbs branching off at several heights — these are
        marked "limb" and are NEVER painted over by blossoms, so the branch
        scaffold stays visible the way it does in the reference;
     3. a crown whose outline is a noisy radial boundary (irregular, rounded,
        feathered top — no flat cut) with blossoms concentrated on the OUTER
        shell + clustered on branch tips, leaving the interior open so limbs
        show through;
     4. weeping strands hanging from twig tips / the canopy underside.

   Returns rows[y][x] = null | {ch, type, depth, tier, tw, d}. */
function growTree({ cols, rows, seed }) {
  const rnd = mulberry32(seed);
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(null));
  const inb = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows;
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  // blossom palettes graded by depth tier
  const bloomFar = [".", "·", "'", "`", ",", '"', ":"];   // dim, receding texture
  const bloomMid = [":", "*", "o", "+", "8", ","];        // mid-canopy mass
  const bloomNear = ["@", "8", "&", "o", "%", "*"];        // bright foreground clumps

  // Trunk and primary limbs win over blossoms so the scaffold reads through the
  // canopy; small twigs ("branch") get covered except where the canopy is open.
  const put = (x, y, ch, type, extra) => {
    x = Math.round(x); y = Math.round(y);
    if (!inb(x, y)) return;
    const cur = grid[y][x];
    if (type === "blossom") {
      if (cur && cur.type === "trunk") return;                                 // trunk always wins
      // big limbs read THROUGH the canopy, but foreground (near) blossoms may
      // sit in front of them, so branches end up partially obscured, not bare
      if (cur && cur.type === "limb" && (extra?.depth ?? 0) < 0.66) return;
      if (cur && cur.type === "blossom" && cur.depth >= (extra?.depth ?? 0)) return;
    }
    grid[y][x] = { ch, type, ...extra };
  };

  // ---- value-noise fields (deterministic): a FINE grain for blossom texture
  //      and a COARSE field for large clusters / negative pockets / recession ----
  const blur = (src) => {
    const d = new Float32Array(src.length);
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        let s = 0, k = 0;
        for (let oy = -1; oy <= 1; oy++)
          for (let ox = -1; ox <= 1; ox++) {
            const xx = x + ox, yy = y + oy;
            if (xx < 0 || yy < 0 || xx >= cols || yy >= rows) continue;
            s += src[yy * cols + xx]; k++;
          }
        d[y * cols + x] = s / k;
      }
    return d;
  };
  const normalize = (f) => {
    let mn = 1, mx = 0;
    for (const v of f) { if (v < mn) mn = v; if (v > mx) mx = v; }
    const span = mx - mn || 1;
    const o = new Float32Array(f.length);
    for (let i = 0; i < f.length; i++) o[i] = (f[i] - mn) / span;
    return o;
  };
  const base = new Float32Array(cols * rows);
  for (let i = 0; i < base.length; i++) base[i] = rnd();
  const field = normalize(blur(blur(base)));                       // fine medium clumps
  const coarse = normalize(blur(blur(blur(blur(blur(base))))));    // big soft clusters
  const at = (f, x, y) => {
    x = Math.max(0, Math.min(cols - 1, Math.round(x)));
    y = Math.max(0, Math.min(rows - 1, Math.round(y)));
    return f[y * cols + x];
  };
  const noiseAt = (x, y) => at(field, x, y);
  const coarseAt = (x, y) => at(coarse, x, y);

  const bloom = (x, y, depth) => {
    depth = clamp01(depth);
    let set, tier;
    if (depth > 0.6) { set = bloomNear; tier = "near"; }
    else if (depth > 0.33) { set = bloomMid; tier = "mid"; }
    else { set = bloomFar; tier = "far"; }
    put(x, y, set[(rnd() * set.length) | 0], "blossom", {
      depth, tier, tw: rnd() < 0.5, d: 3 + rnd() * 5,
    });
  };

  // a weeping strand of blossoms hanging straight down. Width, taper rate and
  // density are all caller-controlled so short/medium/long strands differ a lot.
  const drape = (x, y, len, depth, opts) => {
    const w = opts?.w ?? 1.6;
    const taper = opts?.taper ?? 0.8;                  // how fast the strand narrows
    const base = opts?.dens ?? 0.86;                   // density at the top of the strand
    const fall = opts?.fall ?? 0.85;                   // how fast density thins to the tip
    for (let i = 0; i < len; i++) {
      const frac = i / len;
      const dens = base * (1 - frac * fall) + 0.08;
      const halfw = Math.max(0, w * (1 - frac * taper));
      for (let dx = -halfw; dx <= halfw; dx += 1) {
        if (rnd() < dens) bloom(x + dx + (rnd() - 0.5), y + i, depth * (0.7 + rnd() * 0.45));
      }
      if (halfw < 0.8 && rnd() < 0.55) bloom(x + (rnd() - 0.5), y + i, depth * 0.6);
    }
  };

  // Limbs must never climb into the empty headroom above the crown, otherwise
  // they read as bare branches poking out to the (clipped) top edge.
  const limbCeil = rows * 0.14;

  // ---- recursive limb walk: organic curvature, asymmetry, taper ----
  // Returns nothing; pushes twig tips into `anchors` (for blossom clusters/drapes).
  const anchors = [];
  const branch = (x, y, angle, len, depth, curve) => {
    const steps = Math.max(2, Math.round(len));
    let cx = x, cy = y, a = angle;
    // primary limbs hold the upper hemisphere; thinner twigs may arch outward
    // and droop below horizontal so the branch structure fills the whole crown.
    const loA = depth >= 3 ? 0.22 : -0.55;
    const hiA = depth >= 3 ? Math.PI - 0.22 : Math.PI + 0.55;
    for (let i = 0; i < steps; i++) {
      a += curve + (rnd() - 0.5) * 0.09;               // gentle organic drift each step
      a = Math.max(loA, Math.min(hiA, a));
      cx += Math.cos(a); cy -= Math.sin(a);
      if (cy < limbCeil) { cy += Math.sin(a); break; } // stop before piercing the crown top
      // PRUNE: major limbs may bridge low-density gaps (so they can reach + support
      // detached-looking canopy), but small twigs stay confined to the dense canopy
      if (i > 1 && lobeField(cx, cy) < (depth >= 4 ? 0.05 : 0.16)) break;
      const c = Math.cos(a), s = Math.sin(a);
      let ch = "|";
      if (s < -0.2) ch = c >= 0 ? "\\" : "/";          // drooping twig
      else if (c > 0.35) ch = "/"; else if (c < -0.35) ch = "\\";
      else if (s < 0.55) ch = "~";
      put(cx, cy, ch, depth >= 4 ? "limb" : "branch");
      if (depth >= 4) put(cx + (c >= 0 ? -1 : 1), cy, c > 0.2 ? "/" : c < -0.2 ? "\\" : "|", "limb"); // thicken big limbs
      if (depth <= 2 && rnd() < 0.45) anchors.push([cx, cy, depth]);
    }
    anchors.push([cx, cy, depth]);                     // tip anchor
    if (depth <= 0 || cy < limbCeil + 1) return;       // don't spawn children into the headroom
    if (lobeField(cx, cy) < (depth >= 4 ? 0.06 : 0.2)) return;  // major limbs reach further; twigs stay in the canopy
    const kids = depth >= 3 ? 2 + (rnd() < 0.6 ? 1 : 0)
                            : 2 + (rnd() < 0.7 ? 1 : 0) + (rnd() < 0.3 ? 1 : 0);
    const spread = depth >= 3 ? 0.5 : 0.9;
    for (let k = 0; k < kids; k++) {
      const t = kids === 1 ? 0 : k / (kids - 1) - 0.5;
      let na = a + t * spread * 2 + (rnd() - 0.5) * 0.35;
      // deeper twigs splay further from vertical, beginning to weep -> interior fill
      if (depth <= 1) na += Math.sign(na - Math.PI / 2) * (0.3 + rnd() * 0.45);
      const nc = curve * 0.55 + (rnd() - 0.5) * 0.18;  // children inherit + perturb curvature
      branch(cx, cy, na, len * (0.64 + rnd() * 0.14), depth - 1, nc);
    }
  };

  // ---- trunk: pronounced S-curve, continues as a leader into the crown ----
  const groundY = rows - 1;
  const leaderTopY = Math.round(rows * 0.34);          // leader rises well into the crown
  const H = groundY - leaderTopY;
  const baseX = cols * 0.47;
  const sAmp = cols * 0.1;                              // S-curve amplitude (pronounced)
  const lean = cols * 0.05;                            // slight net lean as it climbs
  const baseHalf = Math.max(3, cols * 0.05);           // half-width at the base
  const path = [];
  for (let i = 0; i <= H; i++) {
    const frac = i / H;                                 // 0 = base, 1 = leader top
    // pronounced S: bows out low-down, sweeps back through, leans the crown over
    const xoff = sAmp * Math.sin(frac * Math.PI * 1.5) + lean * Math.pow(frac, 1.6);
    const x = baseX + xoff + (rnd() - 0.5) * 0.3;
    const halfw = baseHalf * Math.pow(1 - frac, 1.55) + (frac > 0.8 ? 0.4 : 0.7);
    path.push([x, groundY - i, halfw, frac]);
  }
  // The lowest rows dissolve into the ambient ground field with a CONTINUOUS
  // gradient across both density (progressive deletion) and value
  // (solid bark -> dim branch -> faint far particles), so the column reads as:
  // dense vertical trunk -> broken vertical fragments -> sparse symbols ->
  // low-opacity dots -> ambient ground noise, never a hard line->dot switch.
  const baseFadeRows = 6;
  for (const [px, py, hw, frac] of path) {
    const hi = Math.ceil(hw);
    const fromBottom = groundY - py;                     // 0 at the very base
    const t = fromBottom / baseFadeRows;                 // 0 at the base -> 1 at the top of the fade band
    for (let dx = -hi; dx <= hi; dx++) {
      if (Math.abs(dx) > hw + 0.4) continue;
      const edge = Math.abs(dx) > hw - 0.85;
      const n = noiseAt(px + dx, py);
      if (fromBottom < baseFadeRows) {
        if (rnd() > 0.2 + t * 0.85) continue;            // progressive thinning: sparse low, full higher up
        if (t < 0.3) {                                   // faint low-opacity particles (dimmest layer)
          bloom(px + dx, py, 0.05 + rnd() * 0.1);        // far-tier dots / specks
        } else if (t < 0.6) {                            // sparse broken fragments / symbols (dim)
          put(px + dx, py, n < 0.4 ? "," : n < 0.72 ? ":" : ";", "branch");
        } else {                                         // lightened, occasionally-broken vertical lines
          const ch = n < 0.55 ? "|" : n < 0.8 ? ":" : ";";
          put(px + dx, py, ch, rnd() < 0.5 ? "trunk" : "branch");
        }
        continue;
      }
      let ch;
      if (edge && hw > 1.1) {                            // gnarled, uneven bark edges
        ch = dx < 0 ? (n > 0.62 ? "(" : "/") : (n > 0.62 ? ")" : "\\");
      } else if (frac < 0.32) {                          // dense, dark, knotted base
        ch = n < 0.24 ? "8" : n > 0.8 ? "%" : n > 0.52 ? "#" : "|";
      } else {                                           // lighter, grainy bark higher up
        ch = n < 0.28 ? ":" : n > 0.82 ? "/" : n > 0.6 ? ";" : "|";
      }
      put(px + dx, py, ch, "trunk");
    }
  }
  // a few knots / branch scars on the trunk for variation
  for (let i = 0; i < 6; i++) {
    const node = path[((0.15 + rnd() * 0.7) * path.length) | 0];
    const side = rnd() < 0.5 ? -1 : 1;
    put(node[0] + side * (node[2] + 0.2), node[1], rnd() < 0.5 ? "o" : side < 0 ? "<" : ">", "limb");
  }
  // base DISSOLVES into the abstract grass instead of looking planted in soil:
  // only faint, sparse horizontal root hints (dim "branch" tone, no hard flare)...
  const [brx, bry] = path[0];
  for (let s = 1; s <= baseHalf; s++) {
    if (rnd() < 0.5) put(brx - baseHalf - s + 1, bry, s % 2 ? "\\" : "_", "branch");
    if (rnd() < 0.5) put(brx + baseHalf + s - 1, bry, s % 2 ? "/" : "_", "branch");
  }
  // ...and a light scatter of dim "fallen blossoms" fading into the grass field
  for (let i = 0; i < 14; i++) {
    const fx = brx + (rnd() - 0.5) * baseHalf * 4;
    const fy = bry - ((rnd() * 3) | 0);
    bloom(fx, fy, 0.1 + rnd() * 0.12);                  // dim "far" tier -> reads as scattered petals
  }

  // ---- crown geometry, defined UP-FRONT so the limb walk can be pruned to it ----
  const topX = path[path.length - 1][0];
  const nodeAt = (frac) => path[Math.min(path.length - 1, Math.max(0, Math.round(frac * H)))];
  const canCx = topX + cols * 0.01;
  const canCy = rows * 0.43;
  const crownRx = cols * 0.31;
  const crownRy = rows * 0.26;
  // broad core + MANY small scattered satellites; the last few protrude beyond the
  // core (sprouting clusters), but all bounded so the mass never reaches the grid edge.
  const lobes = [{ x: canCx, y: canCy, rx: crownRx * 0.72, ry: crownRy * 0.8, w: 1 }];
  for (let i = 0; i < 15; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 0.3 + rnd() * (i < 11 ? 0.52 : 0.7);   // pulled in so satellites overlap -> one connected mass
    lobes.push({
      x: canCx + Math.cos(ang) * crownRx * 0.66 * rad,
      y: canCy + Math.sin(ang) * crownRy * 0.7 * rad,
      rx: crownRx * (0.17 + rnd() * 0.2),
      ry: crownRy * (0.17 + rnd() * 0.2),
      w: 0.5 + rnd() * 0.5,
    });
  }
  // Explicit fill lobes that guarantee a FULL upper crown (the previous "carved
  // hole" came from negative lobes here — removed; gaps now come only from the
  // coarse cluster field, which reads as natural clumping rather than a bite).
  lobes.push({ x: canCx - crownRx * 0.04, y: canCy - crownRy * 0.6,  rx: crownRx * 0.52, ry: crownRy * 0.46, w: 0.96 }); // upper-centre
  lobes.push({ x: canCx - crownRx * 0.34, y: canCy - crownRy * 0.36, rx: crownRx * 0.42, ry: crownRy * 0.42, w: 0.92 }); // upper-left
  const lobeField = (x, y) => {                          // union of soft lobes (max gaussian)
    let m = 0;
    for (const L of lobes) {
      const dx = (x - L.x) / L.rx, dy = (y - L.y) / L.ry;
      const v = L.w * Math.exp(-(dx * dx + dy * dy));
      if (v > m) m = v;
    }
    return m;
  };
  const crownTopY = Math.max(0, Math.floor(canCy - crownRy * 1.5));
  const crownBotY = canCy + crownRy * 1.12;

  // ---- primary limbs: asymmetric, off several heights, all pruned to the canopy ----
  // [trunk-height fraction, base angle (rad), length factor]
  const limbDefs = [
    [1.00, 1.70, 0.20],   // leader carries on, slightly left of vertical
    [0.94, 2.50, 0.38],   // LONG upper-left limb -> supports the left-upper canopy
    [0.92, 0.85, 0.24],   // upper-right limb
    [0.86, 2.66, 0.40],   // LONG mid-left limb -> supports the left-middle canopy
    [0.78, 0.55, 0.26],   // mid-right, reaches wide
    [0.70, 2.88, 0.34],   // low-left, near-horizontal -> far left canopy
    [0.64, 0.42, 0.27],   // low-right, near-horizontal -> right canopy
    [0.88, 1.45, 0.18],   // inner near-vertical limb
  ];
  for (const [hf, ang, lf] of limbDefs) {
    const [nx, ny] = nodeAt(hf);
    branch(nx, ny, ang + (rnd() - 0.5) * 0.25, rows * lf, 4, (rnd() - 0.5) * 0.14);
  }
  // secondary limbs sprouting along the upper trunk/leader at staggered heights,
  // angled mostly OUTWARD so the hierarchy reaches into the left/right canopy
  for (let f = 0.55; f <= 0.98; f += 0.045) {
    if (rnd() < 0.72) {
      const [nx, ny] = nodeAt(f + (rnd() - 0.5) * 0.03);
      const left = rnd() < 0.5;
      const ang = (left ? 2.5 : 0.64) + (rnd() - 0.5) * 0.7;    // lateral spread
      branch(nx, ny, ang, rows * (0.1 + rnd() * 0.12), 3, (rnd() - 0.5) * 0.2);
    }
  }

  // PASS A — dim, desaturated BACKGROUND layer. Fills interior for depth but the
  // coarse field opens real negative pockets where it is weak; boundary is broken
  // up by the fine noise so no edge is straight.
  for (let y = crownTopY; y < crownBotY; y++) {
    for (let x = 0; x < cols; x++) {
      const dens = lobeField(x, y);
      if (dens < 0.1) continue;                          // hard outer bound -> no far scatter to grid edge
      const edgeN = noiseAt(x, y);
      const upper = (canCy - y) / crownRy;               // >0 above centre, grows toward the top
      const breakAmt = 0.3 + Math.max(0, upper) * 0.85;  // ragged UPPER edge (noise break only -> not a hole)
      if (dens + (edgeN - 0.5) * breakAmt < 0.18 + Math.max(0, upper) * 0.08) continue;
      const cl = coarseAt(x, y);
      let p = clamp01(cl * 1.9 + 0.2);                   // fills the interior densely (dim), pockets where cluster field is weak
      if (dens < 0.32) p *= clamp01(dens / 0.32);        // feather the rim
      if (upper > 0.85) p *= clamp01(1.4 - (upper - 0.85) * 1.4);  // soften ONLY the very top edge
      if (rnd() > p) continue;
      bloom(x, y, clamp01(0.03 + edgeN * 0.16 + cl * 0.12));  // dim "far" tier, gently varied
    }
  }

  // PASS B — clumped FOREGROUND blossoms. The coarse cluster field decides which
  // regions are dense + bright (advancing) vs sparse + dim (receding), giving
  // localized clumps, thinner pockets and depth variation instead of a flat mass.
  for (let y = crownTopY; y < crownBotY; y++) {
    for (let x = 0; x < cols; x++) {
      const dens = lobeField(x, y);
      if (dens < 0.1) continue;                          // hard outer bound -> no far scatter
      const edgeN = noiseAt(x, y);
      const upper = (canCy - y) / crownRy;               // >0 above centre
      const breakAmt = 0.3 + Math.max(0, upper) * 0.8;   // ragged top edge (noise break only)
      if (dens + (edgeN - 0.5) * breakAmt < 0.16 + Math.max(0, upper) * 0.08) continue;
      const cl = coarseAt(x, y);
      const n = noiseAt(x, y);
      const edge = clamp01((0.7 - dens) / 0.6);          // 0 lobe-core -> 1 lobe-rim
      const clump = cl * 0.72 + n * 0.5;                 // dense clumps only where cluster field is strong
      if (clump < 0.46) continue;                        // -> leaves genuine negative spaces
      let p = 0.62 + 0.36 * edge;
      if (dens < 0.26) p *= clamp01(dens / 0.26);        // feather the soft outer rim
      if (upper > 0.85) p *= clamp01(1.4 - (upper - 0.85) * 1.5);  // soften ONLY the very top edge
      if (rnd() > p) continue;
      // whole clusters advance/recede together based on the coarse field
      const depth = clamp01(0.1 + cl * 0.52 + edge * 0.3 + (rnd() - 0.5) * 0.16);
      bloom(x + (rnd() - 0.5) * 0.5, y, depth);
    }
  }

  // PASS C — tight puffs hugging branch tips (also cover any exposed limb tips)
  for (const [ax, ay, d] of anchors) {
    if (ay > crownBotY + 2 || ay < crownTopY - 2) continue;
    if (lobeField(ax, ay) < 0.1) continue;               // only where the canopy mass is
    const cr = 1.5 + rnd() * 2.6;
    const count = 5 + ((rnd() * 8) | 0);
    const puffDepth = clamp01(0.42 + rnd() * 0.42 - d * 0.04);  // each puff its own tier
    for (let k = 0; k < count; k++) {
      const a = rnd() * 6.28;
      const rr = Math.pow(rnd(), 0.6) * cr;
      const x = ax + Math.cos(a) * rr;
      const y = ay + Math.sin(a) * rr * 0.85;
      if (y < limbCeil - 1 || noiseAt(x, y) < 0.1) continue;
      bloom(x, y, clamp01(puffDepth + (rnd() - 0.5) * 0.18));
    }
  }

  // ---- weeping strands: grouped into a few uneven drooping CLUSTERS (not an even
  //      curtain) and kept from hanging too low ----
  const floorY = rows * 0.78;
  const strand = (x, y, kind) => {
    const r = kind ?? rnd();
    let len, opts;
    if (r < 0.5) {             // short, dense, quick taper
      len = 2 + rnd() * 4; opts = { w: 1.2, taper: 0.95, dens: 0.92, fall: 0.9 };
    } else if (r < 0.82) {     // medium
      len = 5 + rnd() * 6; opts = { w: 1.6, taper: 0.8, dens: 0.85, fall: 0.78 };
    } else if (r < 0.95) {     // long, sparse, wispy
      len = 9 + rnd() * 7; opts = { w: 1.1, taper: 0.55, dens: 0.64, fall: 0.55 };
    } else {                   // occasional deeper curtain (still moderate)
      len = 13 + rnd() * 7; opts = { w: 0.9, taper: 0.35, dens: 0.55, fall: 0.4 };
    }
    len = Math.min(len, floorY - y);
    if (len < 2) return;
    drape(x, y, Math.round(len), clamp01(0.22 + rnd() * 0.5), opts);
  };
  const lowestBlossom = (x) => {
    const col = Math.round(Math.max(0, Math.min(cols - 1, x)));
    for (let y = Math.floor(crownBotY); y >= crownTopY; y--) {
      if (grid[y][col] && grid[y][col].type === "blossom") return y;
    }
    return -1;
  };
  // some twig tips weep (only those well inside the canopy mass)
  for (const [ax, ay] of anchors) {
    if (ay > crownBotY || ay < crownTopY) continue;
    if (lobeField(ax, ay) < 0.14) continue;
    if (rnd() < 0.45) continue;
    strand(ax, ay);
  }
  // the underside fringe is concentrated into a handful of uneven clusters at
  // irregular positions, instead of a single broad horizontal curtain
  const nClusters = 5 + ((rnd() * 3) | 0);
  for (let c = 0; c < nClusters; c++) {
    const cxp = canCx + (rnd() - 0.5) * crownRx * 1.7;
    const span = 3 + rnd() * 5;
    const nStr = 3 + ((rnd() * 5) | 0);
    const deep = rnd() < 0.3;                            // a few clusters droop slightly deeper
    for (let s = 0; s < nStr; s++) {
      const x = cxp + (rnd() - 0.5) * span;
      const yLow = lowestBlossom(x);
      if (yLow < 0) continue;
      strand(x, yLow - ((rnd() * 4) | 0), deep && rnd() < 0.5 ? 0.97 : undefined);
    }
  }

  return grid;
}

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
function AsciiTree({ cols = 140, rows = 82, seed = 11 }) {
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
