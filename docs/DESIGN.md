---
name: Cody Jung Portfolio
description: A dark, moonlit single-page portfolio with a playable 3D Minesweeper workbench as its hero.
colors:
  page-floor: "#070a09"
  forest-night: "#0a1210"
  moss-shadow: "#101b17"
  moonlit-paper: "#eceae2"
  lichen: "#a4afa6"
  branch: "#6b7e71"
  lamplight: "#e3d7b7"
  sage: "#91af98"
  pale-sage: "#b3ccb6"
  moonlit-leaf: "#bad6ae"
  sage-wash: "#9ad3b0"
  tile-sage: "#aabeb0"
  tile-opened: "#233b38"
  voxel-wall: "#111e1a"
  wall-glow: "#7fad8d"
  coral-flag: "#cc483d"
  buddy-yellow: "#ffd12f"
  counter-brass: "#e5c781"
  yc-orange: "#ff6600"
  number-1: "#a1d7f3"
  number-2: "#91d4a3"
  number-3: "#f09983"
  number-4: "#c2afea"
  number-5: "#efbc83"
  number-6: "#8ce0d5"
  number-7: "#e7d9b7"
  number-8: "#d2d8db"
typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 4.1vw, 4.3rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.9rem, 4vw, 3rem)"
    fontWeight: 300
  title:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.2
  body-lead:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(0.84rem, 1.04vw, 0.97rem)"
    fontWeight: 400
    lineHeight: 1.85
  body:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.3em"
  button:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  hairline: "2px"
  card: "3px"
  round: "50%"
spacing:
  gutter: "clamp(24px, 7vw, 120px)"
  section: "clamp(70px, 10vw, 150px)"
  stack: "42px"
  card: "26px"
  grid-gap: "18px"
components:
  button-primary:
    backgroundColor: "rgba(154, 211, 176, 0.12)"
    textColor: "{colors.pale-sage}"
    typography: "{typography.button}"
    rounded: "{rounded.hairline}"
    padding: "14px 18px"
  button-primary-hover:
    backgroundColor: "rgba(154, 211, 176, 0.2)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lichen}"
    typography: "{typography.button}"
    rounded: "{rounded.hairline}"
    padding: "14px 18px"
  button-ghost-hover:
    textColor: "{colors.moonlit-paper}"
  chip:
    backgroundColor: "rgba(154, 211, 176, 0.06)"
    textColor: "{colors.pale-sage}"
    rounded: "{rounded.hairline}"
    padding: "5px 10px"
  project-card:
    backgroundColor: "rgba(255, 255, 255, 0.012)"
    textColor: "{colors.moonlit-paper}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  card-nav:
    backgroundColor: "rgba(11, 17, 14, 0.66)"
    textColor: "{colors.pale-sage}"
    rounded: "{rounded.round}"
    size: "42px"
  company-badge:
    backgroundColor: "{colors.yc-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.hairline}"
    height: "16px"
  buddy:
    backgroundColor: "{colors.buddy-yellow}"
    rounded: "{rounded.round}"
    size: "65px"
---

# Design System: Cody Jung Portfolio

## Overview

**Creative North Star: "The Moonlit Workbench"**

The site is a workbench seen at night: built, tactile objects lit by soft moonlight and one warm lamp. The hero is the workbench itself, a finite sage Minesweeper board set into a dark green voxel wall. Visitors can press it, flag it and reset it, and they can also ignore it and keep scrolling. Everything below the hero is the bench's notebook: quiet serif headings, monospaced annotations, hairline rules and measured numbers.

The craft is meant to be visible but never loud. Depth and material belong to the 3D scene (beveled solid geometry, warm diffuse light, restrained shadows). The HTML layer stays flat, dark and translucent, so it reads like light falling on the bench, not like objects competing with it. Color is almost all moonlit green-gray. Warmth comes in small, deliberate doses: the italic accent word, the brass counters, the yellow buddy disc and the coral flags.

Density is low and the pace is calm. Sections breathe on generous fluid padding, text measures stay between 48 and 68 characters, and motion is limited to short entrances, small lifts on hover and the game's own feedback.

**Key Characteristics:**
- Dark only. A deep forest-night gradient runs from the hero down to the page floor.
- Newsreader light serif for anything that is named; IBM Plex Mono for everything that is read or labeled.
- Sage-tinted translucent fills with hairline borders. No solid UI color blocks.
- Nearly square corners (2–3px). Circles are reserved for objects you press (the buddy disc, card arrows, the status dot).
- One tactile 3D object (the board) carries all the depth; the HTML stays flat.

## Colors

A low-chroma moonlit green-gray palette, with a few warm notes rationed to the hero and the game.

### Primary
- **Pale Sage** (pale-sage): Interactive text: primary button labels, chips, card links, card-nav arrows, and the eyebrow line. If a piece of text can be clicked or is a stack/meta label, it's usually Pale Sage.
- **Sage Wash** (sage-wash): Never solid. Used only at low alpha: button fill at 12% (20% on hover), button border at 45%, chip fill at 6% and border at 28%, card hover border at 40%, and the soft hover glow.
- **Moonlit Leaf** (moonlit-leaf): The focus and "live" color: every `:focus-visible` outline, the status dot with its 10px glow, and hover states that reach full intensity (card link, card arrows).

### Secondary
- **Sage** (sage): Quiet structure: section tags, card indices, experience roles, education line, feature-list chevrons, and the card toggle cross.
- **Lamplight** (lamplight): The only warm note in the HTML layer. Reserved for the italic `<em>` accent word in a display headline.

### Tertiary (scene only)
- **Tile Sage** (tile-sage) / **Tile Opened** (tile-opened): Unrevealed and revealed board tiles.
- **Voxel Wall** (voxel-wall) with **Wall Glow** (wall-glow): The relief wall that fills the hero and the selective glow under the pointer.
- **Coral Flag** (coral-flag): Flags, and the hit tile in the accessible fallback.
- **Buddy Yellow** (buddy-yellow): The thick reset disc companion.
- **Counter Brass** (counter-brass): Mine and time counters (tabular numbers, no labels).
- **Number 1–8** (number-1 … number-8): Pastel adjacency numbers: sky, mint, coral, lilac, apricot, aqua, parchment, mist. They stay pastel so they read against Tile Opened without shouting.

### Neutral
- **Page Floor** (page-floor): The `body` background beneath everything, also the dark end of the section bridge gradient.
- **Forest Night** (forest-night) / **Moss Shadow** (moss-shadow): The root gradient (Moss Shadow at the top fading to Forest Night by 70%). Moss Shadow also backs project media.
- **Moonlit Paper** (moonlit-paper): Headings and hover-state text. As `rgba(236,234,226, 0.08–0.16)` it is every hairline divider and ghost border; at 0.72 it is the resting social icon.
- **Lichen** (lichen): Body copy, summaries, ghost button labels, top bar.
- **Branch** (branch): The dimmest readable tone: experience periods, the footer label, eyebrow separators.

### Named Rules
**The Moonlight Rule.** HTML UI color is sage-tinted and translucent. Fills are `rgba(154,211,176, ≤0.2)` over the dark ground, never a saturated or solid block. Bright color lives only inside the 3D scene.

**The Lamp Rule.** Warm color (Lamplight, Counter Brass, Buddy Yellow, Coral Flag) is rationed: one italic accent word per headline in HTML, and game-state objects in the scene. It is never used for decoration.

**The Borrowed Brand Rule.** Third-party brand colors (YC orange `yc-orange`, AfterQuery's black tile, the Mastercard and Google marks) appear only inside their own logo or badge, at logo size.

## Typography

**Display Font:** Newsreader (with Georgia, Times New Roman), light 300 and regular 400, roman and italic, optical size 6–72
**Body/Label Font:** IBM Plex Mono (with ui-monospace, SFMono-Regular, Menlo), 400 and 500

**Character:** A literary light serif names things; a technical mono explains them. The pairing reads as a well-kept engineering notebook: warm in its headings, exact everywhere else. Running copy is monospaced on purpose, which is why it gets generous line height.

### Hierarchy
- **Display** (300, clamp(2.5rem, 4.1vw, 4.3rem), 1.04, −0.015em): The hero headline and the 404 headline only. Max 16ch. One italic Lamplight word allowed. Below 1000px it becomes clamp(2.6rem, 6.5vw, 4.1rem); below 600px, clamp(2.25rem, 9vw, 3.1rem).
- **Headline** (300, clamp(1.9rem, 4vw, 3rem)): Section titles (Selected Experience, Projects, Open Source, About).
- **Title** (400, 1.35rem, 1.2): Project card names and open-source names. Experience company names use 1.28rem.
- **Body Lead** (400, clamp(0.84rem, 1.04vw, 0.97rem), 1.85): The hero sub paragraph, max 48ch (57ch below 1000px). The About body uses a sibling style: 1.02rem, line height 1.85, max 62ch.
- **Body** (400, 0.9rem, 1.75): Experience summaries (max 66ch), card overviews, contribution text (max 68ch). Feature bullets run tighter at 0.86rem / 1.55.
- **Label** (400, 10–12px, uppercase, 0.12–0.32em tracking): Section tags (12px / 0.3em, Sage), eyebrow (10px / 0.19em, Pale Sage), top bar (10px / 0.18em), buttons and card links (10–12px / 0.12em), footer (12px / 0.16em), periods (0.74rem / 0.08em, Branch).

### Named Rules
**The Two Voices Rule.** Newsreader is for names (people, sections, companies, projects). Plex Mono is for everything else, including long-form body copy. Never set a button, label or number in the serif, and never set a heading in mono.

**The Wide Label Rule.** Every uppercase label is tracked out (minimum 0.08em) and kept at 12px or below. Uppercase is never used for sentences.

## Layout

Single column of full-bleed sections on a fluid horizontal gutter (`spacing.gutter`, 24px → 120px). Sections stack with generous vertical padding (`spacing.section`, 70px → 150px). Lists and grids open with a 42px gap below the section heading (`spacing.stack`).

- **Hero (≥1000px):** a two-column grid (0.85fr copy / 1.25fr board) with 26–58px column gap, full viewport height (`100svh`), padding 100px top and 75px bottom on a tighter 24px → 86px gutter. The voxel wall fills the entire header behind both columns, and a left-to-right shade keeps the copy legible.
- **Hero (<1000px):** copy centered (max 720px), and the complete board below it (max 740px wide, height clamp(390px, 95vw, 730px)) with the shade turned vertical.
- **Experience:** three-column rows (heading 0.9fr / summary 1.45fr / period auto) divided by hairlines. Below 920px they stack as heading → period → summary.
- **Projects:** a card grid, 1 → 2 (≥560px) → 4 (≥920px) columns, 18px gap, `align-items: start` so collapsed cards never stretch. The open card spans the full row and jumps to the top (`order: -1`). From 760px up it splits media and details into two columns (1.12fr / 1fr, 40px gap).
- **Open Source:** two-column rows (0.65fr / 1.35fr) on hairlines, stacking below 600px.
- **Footer:** a single row with space-between, wrapping, above a hairline.

**The Measure Rule.** Text never runs full width: 16ch for display, 48–68ch for body. Wide viewports get more air, not longer lines.

## Elevation & Depth

The HTML layer is flat. Depth comes from tonal layering (the root gradient, a 1.2% white wash on cards, Moss Shadow behind media) and from hairline borders. Real dimensionality belongs only to the 3D scene, which has softly beveled solid geometry, warm key/fill/ambient light (3.4 / 1.5 / 1.7, exposure 1.05) and restrained shadows. Glows exist but are small, sage-colored and appear only in response to state.

### Shadow Vocabulary
- **Hover glow** (`box-shadow: 0 0 26px rgba(154,211,176,0.22)`): The primary button on hover, and nowhere else.
- **Status pip** (`box-shadow: 0 0 10px #bad6ae`): The 7px "Seeking Summer 2027" dot.
- **Counter lift** (`text-shadow: 0 2px 12px #050a08`): Keeps the brass counters readable against the wall.
- **Logo ring** (`box-shadow: 0 0 0 1px rgba(236,234,226,0.1)`): Edges dark logo tiles (AfterQuery) against the ground.

### Named Rules
**The Flat-Page Rule.** HTML surfaces have no drop shadows at rest. A shadow or glow appears only as a response to state (hover, live status) or to keep scene-overlaid text legible.

**The One Object Rule.** The board is the only object with physical depth. New UI never imitates it with fake bevels or 3D effects in CSS.

## Shapes

Edges are nearly square. Buttons, chips and badges use a 2px hairline radius (`rounded.hairline`); cards and media frames use 3px (`rounded.card`). Full circles (`rounded.round`) are reserved for things you physically press or that signal life: the yellow buddy disc, the card prev/next arrows and the status pip. Borders are always 1px hairlines in Moonlit Paper or Sage Wash at low alpha. Card media clips to its 3px frame. Small marks carry the geometry: a "›" chevron for feature bullets, a 13 × 1.5px "+" that rotates into "×" for the card toggle, and a 1px fading bar for the scroll cue.

## Components

### Buttons
Precise and quietly luminous: they are lit edges rather than solid slabs.
- **Shape:** Hairline radius (2px), 1px border, inline-flex with a 10px icon gap. Labels are uppercase mono at 10px / 0.12em.
- **Primary:** Sage Wash at 12% fill, 45% border, Pale Sage text, padding 14px 18px (13px 15px under 600px).
- **Primary Hover:** Fill rises to 20%, border to Moonlit Leaf, the hover glow appears, and the button lifts 1px. A trailing arrow slides 3px right.
- **Ghost:** Transparent with a 16% Moonlit Paper border and Lichen text. On hover the text turns Moonlit Paper, the border rises to 40% and the button lifts 1px.
- **Focus:** A 2px Moonlit Leaf outline at 3px offset, on every button. Transitions run 0.25s ease.

### Chips
- **Style:** Tech-stack chips: 11px mono / 0.06em, Pale Sage on a 6% Sage Wash fill with a 28% border, 2px radius, 5px 10px padding, no wrapping.
- **State:** Static. Chips label things and are never interactive.

### Cards / Containers (expandable project card)
- **Corner Style:** 3px.
- **Background:** A 1.2% white wash over the ground. Media sits on Moss Shadow inside its own 1px hairline frame.
- **Shadow Strategy:** None (see the Flat-Page Rule).
- **Border:** 1px hairline at 10% Moonlit Paper. It turns Sage Wash 40% on hover and while open.
- **Internal Padding:** 26px.
- **Behavior:** The whole header is a button. The open card spans the row, moves to the top, centers its body, and shows prev/next circular arrows (42px, 66% dark fill, slight 4px blur) in the side gutters. Framer Motion animates the size change. Collapsed cards keep a constant size so the reshuffle slides without stretching. Preview motion uses stepped sprite sheets, not GIFs, and stops under reduced motion.

### Lists (experience and open-source rows)
- Hairline-divided rows, never boxed. The heading cluster pairs a 28px logo slot (Pale Sage line icons, or a brand tile where the company requires it) with a serif company title and a Sage mono role. Periods are right-aligned uppercase in Branch. The YC badge is a 16px orange tag at 9px / 500 weight.

### Navigation
- **Top bar:** Absolute across the hero. Uppercase Lichen 10px / 0.18em, the name on the left and the live status with its glowing pip on the right (8px / 0.1em under 600px).
- **Social icons:** 21px line icons at 72% Moonlit Paper. On hover they turn full Moonlit Paper and lift 1px.
- **Card link:** Uppercase Pale Sage 12px with a 1px underline border at 40% Sage Wash. On hover both turn Moonlit Leaf and the arrow slides.
- **Footer:** Uppercase Branch label with Lichen links that turn Moonlit Paper on hover.
- Every link gets a 2px Moonlit Leaf focus outline at 4px offset.

### Minesweeper Hero (signature component)
An optional, lazy-loaded Three.js playground: a finite 16 × 16 sage board set into a dark green voxel wall that fills the entire header. Above the board there are only unlabeled brass mine/time counters and the yellow reset disc. Flags are coral, numbers are pastel, and the companion is a thick yellow disc. Tiles lift softly under the pointer (with spring physics) and a ripple runs on reset.
- At desktop widths the introduction holds the left side. Below 1000px the complete board sits beneath the introduction and supports in-place touch pan/zoom.
- The game is controlled through a single-entry keyboard grid. A screen-reader grid mirrors the board, and a styled HTML grid is the non-WebGL fallback.
- Scene parameters live in `src/components/hero/minesweeper/config.js`. Game rules (`game.mjs`) stay independent of presentation, and the renderer and companion never receive the hidden mine layout. See [implementation notes](MINESWEEPER.md) and [review evidence](minesweeper/REPORT.md).

## Do's and Don'ts

### Do:
- **Do** keep HTML fills to Sage Wash at 0.2 alpha or less, with 1px hairline borders (the Moonlight Rule).
- **Do** set names in Newsreader 300/400 and everything else in IBM Plex Mono (the Two Voices Rule).
- **Do** give every interactive element a 2px Moonlit Leaf `:focus-visible` outline.
- **Do** keep hover feedback small: a 1px lift, a 3px arrow slide, or a border brightening over 0.2–0.25s.
- **Do** keep the HTML content stable while the scene's effects run, and keep native page scrolling (including one-finger drag) available over the hero.
- **Do** keep all game-state feedback under `prefers-reduced-motion`, and turn off reveals, the scroll-bar pulse and sprite previews there.
- **Do** keep the game playable without a mouse, through the single-entry keyboard grid.

### Don't:
- **Don't** introduce bright, saturated, or solid color blocks in the HTML UI. Saturated color belongs to the 3D scene and to third-party logos at logo size.
- **Don't** add continuous orbiting, flashing overlays, or decorative motion that competes with reading.
- **Don't** give the HTML layer drop shadows, fake bevels, or CSS 3D. The board is the one physical object.
- **Don't** add labels to the hero counters or extra controls above the board.
- **Don't** introduce a second game input system without preserving the single-entry keyboard grid.
- **Don't** pass the hidden mine layout to the renderer or the companion.
