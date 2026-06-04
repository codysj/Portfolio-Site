# Design System

A reference for anyone — human or LLM — extending this portfolio. Keep new work consistent with what's described here; deviate only with reason.

---

## 1. Identity

A **moonlit ASCII garden** for a CS portfolio. The aesthetic is *technical, elegant, calm.* The site reads as a developer artifact (monospace details, precise generative art) framed by one literary serif gesture (the headline) — that single contrast is the whole personality. Everything else stays restrained.

Three rules that override anything else if they conflict:

1. **Subtle beats loud.** Motion is breathing, not performance. Color is muted, not saturated. Nothing demands attention except the headline and the primary CTA.
2. **Made, not styled.** The ASCII scene is procedurally generated from real geometry (curves, branch walks, drape strands). Never fake it with static art or stock illustrations.
3. **Two-font discipline.** Only Newsreader (serif) and IBM Plex Mono (mono). The serif is reserved for display moments; everything else is mono. Never introduce a third family.

---

## 2. The landing scene

A weeping cherry tree on a rounded hill, right of center, against near-black. Open space on the left holds the copy. Petals drift from upper-right to lower-left across the whole page. The bottom of the hill dissolves into the section below.

Reference target (a frame of the source motion graphic the scene translates to ASCII):

MP4 File of absolute reference: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4

- A bare, curving coral trunk for the lower ~45% of the tree.
- Branches fan **upward only** — never below horizontal — into the upper hemisphere.
- Blossoms hang in drooping, tapering strands with black gaps between them (lacy, not blocky).
- Clear gap between canopy bottom and hill — blossoms never reach the ground.
- Hill surface is **filled** with layered vegetation (shrub clumps, 3 grass depth-bands, flower patches), warmer/denser under the tree, sparser at the edges.
- A warm amber glow pools under the tree where it meets the hill.

When editing the scene, preserve those properties. Density and seed can change; the structural facts cannot.

---

## 3. Color

All theming flows through CSS custom properties declared on `.ah-root`. Reference them by var name in new code; do not hardcode hex outside the token block.

### Background

| Token     | Hex       | Use                                                  |
| --------- | --------- | ---------------------------------------------------- |
| `--bg-0`  | `#070a09` | Page background, deepest stop                        |
| `--bg-1`  | `#0b110e` | Slight warm-black, top stop of the page gradient     |

### Text

| Token       | Hex       | Use                                              |
| ----------- | --------- | ------------------------------------------------ |
| `--ink`     | `#eceae2` | Headline, primary text                           |
| `--ink-dim` | `#98a39a` | Subhead, body, tertiary labels, dim mono details |

### Tree (warm coral)

| Token         | Hex       | Use                                          |
| ------------- | --------- | -------------------------------------------- |
| `--bark`      | `#cf8478` | Trunk + main limbs, with a subtle text-glow  |
| `--bark-dim`  | `#9c5f57` | Thinner branches near the tips               |
| `--rose`      | `#d49aa6` | Far / back blossoms                          |
| `--rose-soft` | `#f3cdd6` | Near / front blossoms (carry a soft glow)    |

### Hill (warm ember)

| Token         | Hex       | Use                                                 |
| ------------- | --------- | --------------------------------------------------- |
| `--ember-dim` | `#6f4a36` | Back depth band of grass; faint receding shrubs     |
| `--ember`     | `#a9744d` | Mid grass band; mid-depth shrubs                    |
| `--ember-lit` | `#d39a6a` | Front grass band; foreground shrub clumps           |

### Accents

| Token           | Hex       | Use                                                 |
| --------------- | --------- | --------------------------------------------------- |
| `--amber`       | `#dab57c` | Gold flowers (target ~28% of flower count)          |
| `--accent`      | `#9ad3b0` | Sole UI accent: primary CTA + "open to work" dot    |
| `--sage`        | `#82a78d` | Section tags (`SELECTED WORK`, `PROFILE`)           |
| `--sage-bright` | `#aacfb6` | Eyebrow text, primary CTA label                     |

### Usage rules

- **One accent only.** The green sage/`--accent` is the only saturated color in the UI chrome. Don't add a second to compete with it.
- **Warmth lives in the scene.** Ember + coral + amber + rose all belong to the landscape. UI surfaces stay neutral (black, off-white, sage).
- **No pure white, no pure black** for text or chrome — always `--ink` / `--bg-0`.
- **Opacity does the heavy lifting.** Depth in the scene is expressed via opacity (0.18–0.95 ranges) on the *same* token, not by adding new colors.

---

## 4. Typography

Two families, loaded together at the top of the stylesheet from Google Fonts.

```
Display:  Newsreader  — weights 300, 400 (italic 300, 400), optical 6..72
Mono:     IBM Plex Mono — weights 400, 500
```

### When each is used

| Context                                     | Family        | Weight | Notes                                      |
| ------------------------------------------- | ------------- | ------ | ------------------------------------------ |
| Hero headline (`h1`)                        | Newsreader    | 300    | `clamp(2.3rem, 6.2vw, 5.2rem)`, lh 1.03, letter-spacing -0.015em |
| Italic emphasis word inside headline        | Newsreader    | 300 it | Colored `--rose-soft` for the single accent word |
| Section titles (`h2`)                       | Newsreader    | 300    | `clamp(1.9rem, 4vw, 3rem)`                 |
| Card titles                                 | Newsreader    | 400    | 1.35rem                                    |
| **Everything else** (eyebrow, subhead, body, buttons, topbar, scroll cue, card body, footer, idx labels, section tags) | IBM Plex Mono | 400/500 | Mono is the default — serif is the exception |

### Reserved patterns

- **Eyebrow / section tag / button / topbar:** ALL CAPS, letter-spacing `.18em`–`.32em`. Small (11–13px).
- **Card index ("01", "02"):** mono, sage, letter-spacing `.2em`, small.
- **Inline separators between mono tags:** `/` colored `--branch` with `.55em` horizontal margin.

### Forbidden

- Adding a third family (Inter, Roboto, system-ui, etc.).
- Using the serif for body copy or buttons.
- Using mono for the headline.
- Bold weights on the serif (300 only; 400 only for card titles).

---

## 5. Layout & spacing

- **Page width:** full bleed. No max-width container around sections — padding handles the gutter.
- **Section padding:** `clamp(70px, 10vw, 150px) clamp(24px, 7vw, 120px)` (vertical/horizontal). Hero uses the horizontal value only; vertical is `100svh` flex-centered.
- **Reading widths:** headline `max-width: 16ch`, subhead `58ch`, longform prose `62ch`.
- **Card grid:** `repeat(auto-fit, minmax(240px, 1fr))`, gap `18px`.
- **Border radius:** essentially zero. Cards `3px`, buttons `2px`. The aesthetic is precise, not soft.
- **Borders:** 1px, low-alpha (`rgba(236,234,226,0.08–0.16)`). On hover, lift to the `--accent` color at higher alpha.
- **Stacking (within the hero):** landscape z-1 → local scrim z-1 (DOM order makes it paint on top) → text z-2.

---

## 6. Components

### Top bar
Absolute, full-width, mono ALL CAPS 12px, `--ink-dim`. Left = name + role (`Cody J. — CS Portfolio`). Right = status (`●` dot in `--accent` + label). Don't grow this into a nav.

### Eyebrow
Mono 11–13px, ALL CAPS, letter-spacing `.32em`, color `--sage-bright`. Tokens joined by `/` separators.

### Headline
Serif 300 italic accents only on one key word. No bold. Keep tight (max 16ch). One italic word per headline maximum.

### Subhead
Mono 0.92–1.06rem, `--ink-dim`, line-height 1.75. One precise sentence describing scope. Not a tagline.

### CTAs
- **Primary:** mono caps, `rgba(--accent, 0.12)` fill, `rgba(--accent, 0.45)` border. Hover lifts both alphas + adds a 26px `--accent` glow. Right arrow `→` shifts 3px on hover.
- **Secondary (ghost):** transparent, `--ink-dim` text, `rgba(--ink, 0.16)` border. Hover brightens text + border.
- Always pair with `:focus-visible` outline in `--accent`.
- Buttons are real `<button>` elements; smooth-scrolls call `scrollIntoView` with reduced-motion fallback to `auto`.

### Scroll cue
Bottom-left, mono caps 11px, `--ink-dim`. A 1px vertical bar that animates in `ah-drop` (scaleY top→bottom).

### Cards
Bordered box, near-zero rounded, hover lifts `-3px` + accent border. Index ("01") mono sage, title serif 400, body mono dim. No icons.

### Section tag
Above each `h2`. Mono caps, `--sage`, letter-spacing `.3em`. Examples: `SELECTED WORK`, `PROFILE`.

### Footer
Single line, mono caps, `--branch` (warm gray), top border alpha-low.

---

## 7. Motion

### Philosophy
Everything **breathes**. No element jumps, snaps, or springs. Cycle durations are long (3–16s). Amplitudes are imperceptible-to-small. Nothing competes with the headline for attention.

### Catalog

| Name           | Target                          | Period   | What it does                                    |
| -------------- | ------------------------------- | -------- | ----------------------------------------------- |
| `ah-sway`      | Tree wrapper                    | 11s      | Rotate ±0.5° around the trunk base              |
| `ah-twinkle`   | ~60% of blossoms                | 3–7.5s   | Opacity 0.4 ↔ 0.95                              |
| `ah-gwave`     | All grass blades                | 3–6s     | Rotate ±5° around blade base (per-blade delay)  |
| `ah-fpulse`    | All flowers                     | 4–7s     | Opacity + scale (0.45/0.9 ↔ 1/1.1)              |
| `ah-breath`    | ~40% of hill shrubs             | 5–10s    | Opacity 0.32 ↔ 0.7                              |
| `ah-breathe`   | Background radial glows         | 16s      | Opacity 0.85 ↔ 1, scale 1 ↔ 1.05                |
| `ah-fadeup`    | Hero copy entrance              | 0.9s     | Translate 16px ↑ + fade, staggered 50–800ms     |
| `ah-drop`      | Scroll-cue bar                  | 2.4s     | scaleY origin-flip                              |
| Petals (canvas)| FallingPetals                   | continuous | Drift down-and-left with sine sway; respawn top-right |

### Rules

- **Opacity-only when possible.** Transforms on inline characters inside `<pre>` cause layout reflow. Animate opacity instead. Sway/wave are exceptions where the wrapper is positioned.
- **Stagger via negative delays.** Use `animation-delay: -<rand>s` to desynchronize identical loops.
- **Always honor `prefers-reduced-motion: reduce`.** All ambient motion freezes; the petal canvas paints one static sparse frame and exits; the entrance reveal sets `opacity:1` immediately; `scrollIntoView` falls back to `auto`.
- **Never add scroll-driven animation** (parallax, scroll-locked sections). The scene is a steady environment, not a ride.

---

## 8. The ASCII scene — design constraints

If you regenerate or extend the scene:

### Tree
- Trunk: bare, curving (gentle S-curve), 3-wide at the base tapering to 1-wide, characters `( | ) { }`.
- Branches: fan into the **upper hemisphere only** (clamp angles to `[0.4, π − 0.4]`). Use `/ \ |` based on slope.
- Blossoms: hang in **drooping strands** from anchor points along upper branches, tapering to a point. Strand width starts at ~1.6 cells and narrows linearly.
- Depth: every blossom carries a `depth ∈ [0,1]`. `depth > 0.55` → "near" set `@ * o 8 &` colored `--rose-soft` with glow; otherwise "far" set `. · ' " , :` colored `--rose`. Inline opacity scales as `0.35 + depth*0.6`.
- Canopy bottom must stop above `floorY = rows * 0.6`. The bare trunk below the canopy is intentional — preserve it.

### Hill
- Profile is a gaussian: `hillTop(t) = base + (crest − base) * exp(−(t − peak)² / 2σ²)`. Current values: `peak=0.7, σ=0.32, base=12%, crest=30%`. Shared between hill, grass, and tree anchor.
- Surface is **filled** with three layers:
  1. A warm radial mass glow (amber pooled under the tree + dim ember body).
  2. ~240 shrub clumps, depth-graded (small/dim at back → larger/lit at front), denser near the crest.
  3. Three grass depth bands (back/mid/front) of ~220 blades total, plus ~38 flowers in 7 clustered patches.
- The hill has **no hard surface line**. Vegetation density defines the silhouette.
- Bottom of the landscape fades out via `mask-image: linear-gradient(to bottom, #000 70%, transparent 100%)` so it dissolves into the next section.

### Background (full page, ambient)
- Two radial glows (warm amber moon, cool sage ambient) breathing at 16s, blurred 40px.
- Soft-light grain via inline SVG `feTurbulence` data URI at 0.05 opacity.
- Left-side scrim guarantees text contrast over the tree.

### Petals (canvas)
- Count: `min(80, viewport_width / 16)`; halved below 640px.
- Chars: `' · . *` only. Color: rose tints with alpha 0.25–0.75 and a slow flicker.
- Vector: `vy 0.25–0.8`, `vx −0.12 to −0.55`, sine sway. Respawn on exit (top + right-biased).

### What not to do
- Don't fill the canopy as a solid ellipse — that's the blocky-silhouette failure mode.
- Don't add branches angled below horizontal.
- Don't add a hard ground line under the vegetation.
- Don't let blossom strands reach the hill — keep the gap.
- Don't introduce a third tree, a moon, mountains, or any new scene element. The composition is intentionally singular.

---

## 9. Voice & content tone

### Principles

- **Precise over impressive.** "Computer science portfolio featuring full-stack systems, AI-assisted research tools, and quantitative engineering projects" is the model — a scope statement, not a sales pitch.
- **Technical nouns, not adjectives.** "Orderbook simulator," "feature store," "retrieval-augmented tooling" — name the thing.
- **One italicized word per headline,** and only in the serif headline. It marks the conceptual center of the sentence (e.g., *edge*).
- **No exclamation marks. No emoji in copy.** Sole exception: the `→` arrow on the primary CTA.
- **No first-person superlatives** ("award-winning," "passionate," "world-class"). Describe the work; let the work be the claim.
- **Lowercase ideas, uppercase labels.** Section *titles* are simple words ("Projects," "About"). Section *tags* above them are mono caps ("SELECTED WORK," "PROFILE").

### Copy templates

- **Project card description:** one sentence, ~14–24 words, present tense, no marketing verbs ("revolutionize," "streamline"). Pattern: `A <thing-class> for <use-case>, <key technical detail>.`
- **Section intro paragraph:** 2–4 sentences, ~40–80 words, `--ink-dim`, line-height 1.85.
- **Status pill (top-right):** four words or fewer ("Open to work," "Building privately").

### Brand
- **Display name:** `Cody J.` (period, non-breaking space allowed in mono contexts: `Cody&nbsp;J.`).
- **Always paired** with the role descriptor `— CS Portfolio` (em dash, spaced) in the top bar.

---

## 10. Accessibility & performance

### A11y
- Every background / decorative layer carries `aria-hidden="true"`. The scene communicates nothing to a screen reader.
- All animations stop under `prefers-reduced-motion: reduce`.
- Focusable controls (`<button>`, `<a>`) get a visible `:focus-visible` outline in `--accent`.
- Contrast minimum: text is `--ink` on `--bg-0` (≈14:1). Tertiary text uses `--ink-dim` (still WCAG AA at body sizes). Never use a lower-contrast color for content text.
- Smooth scroll degrades to `auto` under reduced motion.

### Perf budget
- One `requestAnimationFrame` loop on the page (petal canvas), DPR-capped at 2×.
- Tree generation runs once per mount via `useMemo` with a seeded PRNG (`mulberry32`) — deterministic, no re-randomization on re-render.
- Per-character spans only where animation requires per-element variance (twinkling blossoms, waving blades, pulsing flowers, breathing shrubs); contiguous runs of static characters are emitted as plain text or single spans.
- Animations are opacity-only on inline characters to avoid layout reflow; transforms are reserved for positioned wrappers (sway, gwave, fpulse).
- Petal count auto-thins below 640px viewport.
- No external image assets, no animation libraries, no icon font.

---

## 11. File & code architecture

Everything for the landing page lives in `AsciiHero.jsx`. Components, in render order:

```
HeroPage
├── <style> (injected stylesheet — tokens, components, keyframes, media)
├── AsciiHeroBackground          (full-page ambient)
│   ├── .ah-glow.moon            warm radial behind canopy
│   ├── .ah-glow.amb             cool radial lower-left
│   ├── FallingPetals            canvas, rAF, respects reduced-motion
│   ├── .ah-grain                inline SVG turbulence overlay
│   └── .ah-scrim                full-page left+bottom darkening
├── HeroContent                  (the landing section itself)
│   ├── AsciiLandscape           hero-scoped, mask-faded at bottom
│   │   ├── AsciiHill            mass glow + shrub texture
│   │   ├── AsciiTree            sway wrapper + procedural <pre>
│   │   └── AsciiGrass           depth-banded blades + flower patches
│   ├── .ah-hero-scrim           local left-darkening for copy contrast
│   ├── topbar / eyebrow / h1 / subhead / CTAs / scroll cue
└── Placeholders                 projects + about + footer
```

### Tuning knobs (where to change what)

| Want to change…                  | Edit                                                  |
| -------------------------------- | ----------------------------------------------------- |
| Tree shape                       | `AsciiTree seed` (reroll) or `growTree` `baseAngles`  |
| Where canopy stops               | `growTree` `floorY` constant                          |
| Tree position                    | `--tree-x` / `--tree-y` on `.ah-tree-wrap`            |
| Hill shape                       | `HILL = { peak, sigma, base, crest }`                 |
| Vegetation density               | `AsciiHill shrubCount`, `AsciiGrass bladeCount/flowerCount` |
| Gold flower ratio                | The `0.28` threshold in `AsciiGrass` (`gold = rnd() < 0.28`) |
| How far the hill base fades      | The 70% stop in `.ah-landscape` mask                  |
| Color palette                    | The token block on `.ah-root`                         |
| Petal count or speed             | `FallingPetals` `makePart` + the `parts` size formula |
| Animation cycle lengths          | Keyframe `@keyframes` rules + per-element `--gd`/`--fd`/`--bd`/`--d` style vars |

### Conventions for new code

- Tailwind classes are used **only** for structural utilities that are core (flex, grid, items-*, justify-*, absolute, inset-0, min-h-screen, z-*, gap-*, px-*, py-*). All theming, custom sizing, colors, gradients, and animations go in the injected `<style>` block via CSS variables or semantic classes.
- No arbitrary-value Tailwind (`bg-[#…]`, `w-[42px]`). Use inline `style` or the stylesheet.
- New animated element classes follow the existing pattern: `--d`/`--fd`/etc. for per-element duration; `animation-delay: -<rand>s` for stagger.
- New scene elements live inside `AsciiLandscape` and ride `hillTop(t)` for vertical placement so they align with the hill curve.
- If a generator needs randomness, use `mulberry32` with a fixed seed inside `useMemo` — never `Math.random` in render.

---

## 12. Anti-patterns (do not do)

- ❌ Generic SaaS chrome: rounded cards, drop shadows, purple-to-blue gradients, Inter, lucide icons in chips.
- ❌ A second accent color competing with `--accent`.
- ❌ Bold serif headlines, or italic mono.
- ❌ Solid-fill canopy (the blocky silhouette failure).
- ❌ Branches pointing below horizontal.
- ❌ A hard ASCII ground line under the vegetation.
- ❌ Marketing copy: "revolutionary," "next-gen," "AI-powered" as adjectives.
- ❌ Emoji in UI text. (Only `→` on the primary CTA, and `●` in the status indicator.)
- ❌ External image assets, animation libraries, icon fonts.
- ❌ Scroll-jacking, parallax, springy interactions.
- ❌ Toast notifications, modals, or any element with `position: fixed` competing with the hero.
- ❌ Light mode. The site is dark, by design and identity.