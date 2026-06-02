import { mulberry32 } from "@/lib/random";

/* ------------------------- procedural tree generator ---------------------- */

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
export function growTree({ cols, rows, seed }) {
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
