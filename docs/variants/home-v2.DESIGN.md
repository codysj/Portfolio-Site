---
name: Cody Jung Portfolio, White Relief (/home-v2)
description: A temporary light-theme branch of the home page. The playable 3D Minesweeper relief is re-lit in white, and Experience, Projects & Open Source and About are merged into one animated instrument, built three ways (Stage, Mosaic, Prism).
colors:
  ground: "#eef0ee"
  tile: "#f7f8f7"
  paper: "#ffffff"
  well: "#e4e8e6"
  ink: "#15191a"
  ink-secondary: "#3b4342"
  ink-muted: "#5a6361"
  line: "rgba(21, 25, 26, 0.12)"
  line-strong: "rgba(21, 25, 26, 0.22)"
  accent: "#0b6e5a"
  accent-wash: "#d3e8e0"
  shade: "#20282c"
  coral: "#e0533f"
  buddy-yellow: "#ffd12f"
  scrollbar-thumb: "#a3aca9"
  scene-clear: "#e9ecea"
  scene-tile: "#f4f6f5"
  scene-socket: "#8a9390"
  loss-cell: "#f6c9c0"
  wrong-mark: "#d9472f"
  count-1: "#1f68a8"
  count-2: "#23804a"
  count-3: "#c8432e"
  count-4: "#5a3fae"
  count-5: "#a85a0c"
  count-6: "#0f7a74"
  count-7: "#6b5a2e"
  count-8: "#4a5357"
typography:
  display:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.1vw, 4.3rem)"
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  headline-stage:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 2.3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  headline-mosaic:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.7vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline-prism:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.8vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  item-title:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  lead:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  body-small:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.25
  chip:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    lineHeight: 1.5
  counter:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(18px, 2vw, 29px)"
    fontWeight: 600
    letterSpacing: "0.06em"
    fontFeature: "tnum"
rounded:
  hairline: "2px"
  sm: "3px"
  md: "4px"
  lg: "6px"
  disc: "50%"
spacing:
  gutter: "clamp(16px, 4.5vw, 86px)"
  peek: "76px"
  max: "1320px"
  spine: "56px"
  touch: "44px"
  control: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-ghost:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.chip}"
    rounded: "{rounded.sm}"
    padding: "3px 9px"
  badge-current:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  preview-switch:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "4px 4px 4px 12px"
  preview-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.hairline}"
    height: "32px"
  stage-plate:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
  stage-spine:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-secondary}"
    width: "56px"
  stage-list-well:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.md}"
    padding: "6px"
  mosaic-tab:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
  mosaic-tab-selected:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  mosaic-panel:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.lg}"
  prism-tab:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.hairline}"
    padding: "0 18px"
    height: "46px"
  prism-tab-selected:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  prism-face:
    backgroundColor: "{colors.tile}"
---

# Design System: White Relief (/home-v2)

> **Scope.** This file documents the **temporary `/home-v2` branch** only: the routes `/home-v2` (redirects to `/home-v2/stage`), `/home-v2/stage`, `/home-v2/mosaic` and `/home-v2/prism`. It is derived from the shipped code in `src/app/home-v2/` and `src/components/home-v2/`. **`docs/DESIGN.md` remains the design system for `/`** (the dark, moonlit site). Nothing here applies to `/`: every class is prefixed `hv-`, and page-level overrides are scoped with `html:has(.hv-root)`, so none of it leaks out. The routes are marked `noindex, nofollow`.

## Overview

**Creative North Star: "The White Relief"**

The whole page is one matte white surface lit by a single lamp in the upper left. Things are told apart by height, not by color: the Minesweeper board is made of the same white tiles as the wall around it, so the only way you see the board is the relief and the shadows it casts. The UI below the hero follows the same rule. Controls sit raised like unrevealed tiles, a selected control sinks into a recessed well like a revealed cell, and every shadow falls down and to the right.

The section content is light and editorial: one sans family, cool graphite ink on cool off-white, plenty of room around it. Motion is physical. Transitions run on damped springs (`springStep` in `motion.js`), hover lifts are a pixel or two, and the bigger moments (sliding plates, a field of flipping tiles, a turning prism) all reuse that same one-light model. Color is held back. One deep teal marks live state. Coral and yellow appear only as game meaning (flags, loss, the reset smiley).

Experience, Projects & Open Source, and About share one interface, the "instrument", inside `main#work`. Three directions are built on one shared shell and one hero, and a temporary preview switcher moves between them.

**Key Characteristics:**
- A light-theme fork of the incumbent hero: same composition, same playable 16x16 board, re-lit white.
- One upper-left light source, shared by the Three.js key light, CSS shadows, Mosaic's tile shade keyframes and Prism's Lambert face shading.
- Depth comes from relief: raised caps, recessed wells, pressed states. Fills and borders do very little.
- A single teal accent for live state only. No gradients as decoration, no glow, no bloom.
- Spring physics for every animated value, with a reduced-motion path that keeps the feedback and drops the motion.

## Colors

The palette is cool, low-chroma neutrals graded by height, plus one teal for live state and two game colors.

### Primary
- **Deep Lagoon Teal** (`accent`): the only live-state color. It marks the current section (Stage rail fill and rotated square, Mosaic selected tab icon, Prism plan edge and tab mark), the open Mosaic project toggle, focus rings, the 3D focus ring on the board, the topbar status dot and the caret. 5.4:1 on ground.
- **Teal Wash** (`accent-wash`): text selection, and the "current role" badge background in Stage.

### Neutral (graded by height, lowest to highest)
- **Recessed Well** (`well`): revealed cells, list wells, selected (pressed) tabs, chips, education callouts, media letterbox.
- **Ground** (`ground`): the page and the wall's far field. Also the sticky bar backgrounds, so pinned controls read as part of the floor.
- **Tile Face** (`tile`): raised surfaces: ghost buttons, tabs, Mosaic panel, Prism faces, Stage spines, open-source cards.
- **Paper** (`paper`): the highest surface: Stage plates, the preview switcher, the sliding list indicator, logo tiles, the selected Prism project pick.
- **Graphite Ink** (`ink`): headings, primary button fill, the active switcher segment, 3D counter numerals. 15.5:1 on ground.
- **Slate** (`ink-secondary`): body and secondary text, flag poles. 8.9:1 on ground.
- **Pewter** (`ink-muted`): periods, indexes, group labels, diamond bullets. 5.4:1 on ground.
- **Hairline / Hairline Strong** (`line`, `line-strong`): dividers, card outlines, the Stage rail track.
- **Shadow Tone** (`shade`): never used as a fill. It is the RGB triplet (`--hv-shade: 32 40 44`) behind every shadow, used as `rgb(var(--hv-shade) / a)`, so shadows are cool grey, never black.

### Game semantics (the hero board only)
- **Signal Coral** (`coral`): flags, the hit cap, loss fragments and the loss ring. **Wrong-flag Red** (`wrong-mark`) is the X on a wrong flag. **Loss Blush** (`loss-cell`) is the hit cell on the fallback board.
- **Buddy Yellow** (`buddy-yellow`): the smiley reset disc, the only saturated object in the scene.
- **Count inks** (`count-1` to `count-8`): the original pastel number hues pushed darker so they read on white. Drawn into a canvas glyph atlas.
- **Scene values** (`scene-clear`, `scene-tile`, `scene-socket`): the WebGL clear color, the cap and wall albedo, and the flag socket.

### Named Rules
**The One Teal Rule.** Teal means "this is live or selected" and nothing else. If it is not a current section, an open item, focus, or the status dot, it is not teal.

**The Seamless Board Rule.** Board caps and wall voxels share one albedo (`scene-tile`), one size (0.95) and one bevel (0.05). Caps never tint on hover. Lift and shadow carry the affordance. The only cap that changes color is a hit mine (coral).

**The Cool Shadow Rule.** Every shadow is `rgb(var(--hv-shade) / a)` at 0.08 to 0.30 alpha. Never pure black, never warm.

## Typography

**Display Font:** Albert Sans (via `next/font/google`, exposed as `--hv-font`, with `system-ui, sans-serif` fallback)
**Body Font:** Albert Sans
**Label/Mono Font:** none. Numbers use tabular figures (`font-variant-numeric: tabular-nums` on the root).

**Character:** One geometric-grotesque family carries everything, with tight negative tracking at display sizes and plain, generous body text. Weight 600 does the work. Italic appears only as the `em` segment in the hero headline.

### Hierarchy
- **Display** (`display`): the hero h1 only, max 15ch, balanced wrap. Steps to `clamp(2.4rem, 6.5vw, 4rem)` at 1000px and below, and `clamp(2.2rem, 9.4vw, 3rem)` at 600px and below.
- **Headline** (`headline-stage` / `headline-mosaic` / `headline-prism`): the section h2 in each direction. Each direction tunes its own size. Stage tightens to `clamp(1.6rem, 2vw, 2.1rem)` on shorter or narrower stages.
- **Title** (`title`): project and company names in the detail view (Stage experience grows to `clamp(1.6rem, 2.3vw, 2.2rem)` on the stage). Prism's detail h3 is `clamp(1.4rem, 2vw, 1.75rem)`.
- **Item title** (`item-title`): role names, open-source names, list picks (16 to 18px, 600 to 650).
- **Lead** (`lead`): the About body and Stage summaries, max about 60ch. The hero subline is `clamp(.95rem, 1.08vw, 1.04rem)` at 1.7, max 48ch.
- **Body** (`body`, `body-small`): overviews, summaries and feature lists at 14.5 to 16px, about 1.6, max 62 to 68ch.
- **Label** (`label`): tabs, topbar, rail, switcher, periods (13 to 15px, 500 to 600). Never uppercase.
- **Chip** (`chip`): tech chips and badges (12 to 13px).
- **Counter** (`counter`): the HTML fallback for the mine and time counters. In WebGL these become extruded seven-segment numerals.

### Named Rules
**The No Kicker Rule.** No eyebrow label above a heading. The legacy `tag` metadata in `content.js` is never rendered. The hero focus areas sit *below* the headline, separated by small rotated squares.

**The Sentence Case Rule.** Labels, tabs and buttons are sentence case at weight 600. Hierarchy comes from size and weight, not caps or tracking.

## Layout

- **Root tokens:** side gutter `clamp(16px, 4.5vw, 86px)`, content max width 1320px, and a `--hv-peek` of 76px. The hero is `100svh - 76px` tall, so the top of the instrument always shows at the fold.
- **Hero:** a two-column grid (`.85fr` copy / `1.25fr` board), gap `clamp(26px, 3vw, 58px)`, top padding 100px for the absolute topbar. The WebGL scene fills the whole header behind both columns. A left-to-right ground veil (0.94 to transparent by 72%) keeps the copy at AA contrast over the wall. At 1000px and below it becomes a single column: copy (max 720px) above a board anchor of `clamp(390px, 95vw, 730px)`, and the veil turns vertical.
- **Board anchor:** `clamp(470px, 100svh - 160px - peek, 740px)` tall. The camera fits the 16x16 board plus the counter row (18.8 by 21 world units) into it.
- **Instrument:** `main#work`, one direction at a time. Each direction pins its control bar to `top: 0` on a ground-colored band.
- **Footer:** a hairline top border, max 1320px, 40px over 88px of padding (bottom room for the fixed switcher).
- **Breakpoints in use:** 460, 600, 640, 720, 900, 1000, 1024x680 (the Stage threshold), 1400 and 860-tall (Stage compaction).
- **Touch targets:** 44px minimum on links and repo buttons, 48px on hero CTAs, 52 to 74px on mobile tabs.

## Elevation & Depth

This system uses real shadows with one direction of light. Light comes from the upper left, so every shadow is offset down and to the right with a soft blur, and a press is an inset shadow from the same direction. Surfaces step up from `well` to `ground` to `tile` to `paper`, and the shadows confirm the height.

### Shadow Vocabulary
- **Lift 1** (`--hv-lift-1`: `1px 1px 2px rgb(shade/.14), 2px 4px 10px rgb(shade/.08)`): resting raised controls: buttons, tabs, logo tiles, cards, the list indicator.
- **Lift 2** (`--hv-lift-2`: `1px 2px 3px rgb(shade/.16), 4px 10px 22px rgb(shade/.12)`): hover on raised controls, panels (Stage plate, Mosaic panel), media, the switcher, the selected Prism pick.
- **Lift 3** (`--hv-lift-3`: `2px 3px 6px rgb(shade/.16), 10px 22px 48px rgb(shade/.16)`): the Prism body, the tallest object below the hero.
- **Press** (`--hv-press`: `inset 1px 2px 3px rgb(shade/.18)`): button `:active` (80ms), selected Prism tabs, list wells, education callouts, Prism media mats.
- **Tray** (Mosaic only: `inset 1px 2px 4px rgb(shade/.16), inset -1px -1px 2px rgb(255 255 255/.7)`): the tab tray and selected tab, a well with a lit lower-right lip.
- **Cap highlight** (`inset 1px 1px 1px rgb(255 255 255/.9)`): layered on Mosaic tabs, logos and toggles so a raised cap catches the light on its upper-left edge.

### The hero scene (Three.js)
The hero is a real-time WebGL relief (`hero/minesweeper/runtime.js`, `world.js`, `config.js`, `pipeline.js`):

- **Renderer:** `WebGLRenderer` (alpha, low-power, no native AA), sRGB output, **Neutral tone mapping** at exposure 1, clear color `scene-clear`, `PCFShadowMap`, local clipping on. DPR is capped at 1.4 on desktop and 1.25 on mobile, with a 1.6M-pixel budget.
- **Camera:** an orthographic camera at z=32 that always looks at the origin. Its position drifts with the pointer (parallax 2.5) and scroll (2.4) through an exponential ease, and is frozen to zero under reduced motion or while the user is interacting with the board.
- **Lights:**
  - `HemisphereLight` with a white sky and a cool grey ground (`#c3cbc8`), intensity 1.6. This is the ambient lift that keeps the white from going grey.
  - Key `DirectionalLight` in warm white (`#fffaf2`), intensity 2.5, direction `(-9, 11, 13)` normalized to distance 60. This is the upper-left light, and the only shadow caster. Shadow map is 2048 (1024 under 700px wide), `normalBias 0.02`, `bias -0.0004`, `radius 4`, **`shadow.intensity 0.82`** (so shadows never go fully dark). The shadow frustum is resized to the visible wall on every resize.
  - Fill `DirectionalLight` in cool `#e8eef2`, intensity 0.55, from the lower right `(9, -3, 10)`. It casts no shadow and only softens the shadowed sides.
- **Materials:** `MeshStandardMaterial`, roughness 0.7, metalness 0.025. Matte, with no specular sheen.
- **Geometry:** board caps are `RoundedBoxGeometry` (0.95 x 0.95 x 0.43, bevel 0.05). Revealed floors are thin recessed slabs (0.94 x 0.94 x 0.08) in `well`. The wall uses the same lattice. At the board edge it is flush, then relief builds outward through `smoothstep(..., 0, 4)` to up to 1.5 units of seeded random depth, with a per-voxel shade of 0.975 to 1.0. The wall casts its shadow through a separate unbeveled box proxy (color and depth writes off) to save on the shadow pass.
- **Post:** `EffectComposer` with a RenderPass, then **SMAA only if MSAA (up to 4x) is unavailable**, then OutputPass. HalfFloat targets when `EXT_color_buffer_float` is available. **No bloom**: on a white field any halo washes the tiles out.
- **Depth motion:** hovered caps lift 0.19 (neighbors 0.065) on a spring (stiffness 145, damping 20), and a press sinks 0.13. Wall voxels near the cursor rise up to 0.48 under a Gaussian falloff. Reveals stagger outward from the clicked cell (up to 0.34s). Loss, win and reset send a radial wave (speed 10, width 1.4) through caps and wall, and loss adds 48 coral fragments and a faint coral ring.

### Named Rules
**The Single Lamp Rule.** One light, upper left, everywhere: CSS offsets are always positive x and positive y. Mosaic's flipping tiles throw their shade to `translate(9px, 16px)`. Prism faces are lit by Lambert against the same light (`LIGHT_X -0.6, LIGHT_Z 0.8`). Its cast shadow is pushed right.

**The Raised Means Available, Pressed Means Chosen Rule.** An unselected control is a raised cap (lift). A selected one sinks into the well (press, `well` fill, `translateY(1px)`). Selection is never a color fill alone.

## Shapes

The corners are small and squarish, like machined tiles: 2px for Prism controls and the switcher's active segment, 3px for buttons, chips and media, 4px for cards, logos and the Stage plate, and 6px only for the Mosaic panel and tray. The only circle is the buddy disc. The recurring motif is the **rotated square**: the topbar status dot, the hero focus separators, diamond feature bullets, and the Stage and Prism tab markers, which turn 45 degrees when active. The board's 3D focus ring is a four-segment torus rotated 45 degrees, the same diamond. Prism's plan icon is a literal equilateral triangle.

## Components

### Shell (`HomeV2Shell`)
*A quiet frame around one loud object.* It renders the hero, then `main#work` holding the chosen direction, then the footer and the preview switcher. It loads `home-v2.css` and the root tokens on `.hv-root` (`isolation: isolate`, `overflow-x: clip`). Focus is a 2px teal outline offset 3px. Links underline at 0.22em offset, 1px thick.

### Hero (`HeroContent`, `Minesweeper`)
- **Copy:** brand and status topbar, the h1 (the greeting segment on its own line), focus areas joined by rotated squares, the subline, a row of 40px social icons, then CTAs. The entrance is a staggered `hv-fadeup` (14px rise, 0.9s, ease-out-expo) with delays from 0.05s to 0.8s, plus a pulsing scroll cue.
- **CTAs:** a **primary** button (graphite on white, with an arrow that slides 3px on hover) scrolls to `#work` and fires the `hv:section` event with `"projects"`. Every direction listens for it. A **ghost** button (tile face, hairline border) links to the resume. Both lift -2px to lift 2 on hover and press on active.
- **Board:** the WebGL scene described under Elevation. HTML `output` counters and the yellow smiley button are positioned over the projected 3D points, and become transparent once the scene is live (`.hv-ms-live`). Game rules are imported unchanged from the incumbent `game.mjs`. The fallback board (no WebGL) is CSS: white caps with an inset highlight and a down-right shadow, revealed cells recessed in `well`, and SVG marks (never text glyphs). Keyboard: arrow keys, Home/End, Enter/Space, F. Touch: tap, hold to flag, two-finger pan or zoom (1 to 2.8x).

### Preview switcher (`DirectionSwitch`)
*A temporary control, not part of the design.* Fixed to the bottom right (16px, or 12px at 600px and below). A paper pill with a hairline and lift 2, a muted "Preview" label, and three 32px links: Stage, Mosaic, Prism. The current one is graphite with white text (`aria-current="page"`). Remove it when a direction ships.

### Direction: Stage (`/home-v2/stage`, `ScrollStage`)
*Scroll moves you through it, like a slide deck that lives in the page.*
- **Mechanism:** a tall track holds a sticky full-viewport stage. The native scroll position is read (scroll is never hijacked), mapped to a timeline of units (one per list item, plus one unit per section change), and followed by a critically damped spring (stiffness 170, damping 26). One engine owns every moving value: each frame it writes inline styles on only the dozen elements that move, and only when a value changed. It never writes an inherited custom property, so the deck subtree is not restyled per frame. React state (aria-current, inert, step buttons) commits only when the motion comes to rest. A clicked jump (rail tab, list row, step button, hero CTA) is one eased scroll capped at 0.9s however far it travels. Proximity snap is suspended while it runs, the spring is bypassed so the two never stack, and wheel, touch or keyboard input cancels it.
- **Deck:** three paper plates laid edge to edge. Inactive plates fold to 56px **spines** (tile face, vertical label, a square that turns from a diamond to flat as the plate is covered). On a section change, the next plate slides out from its spine while the current one fades and recedes -10cqw. Z-order steps down, so each plate casts its shadow on its right-hand neighbor, and the shadow deepens while an edge is moving (`fly`, computed by the engine). During the last item of a section, the next plate peeks out 6% as a hint.
- **Rail:** three tabs on one hairline. Each fill bar scales with progress (graphite for past sections, teal for the current one). The marker is an outlined square, filled when past, and a teal diamond with a small shadow when current.
- **List well:** a recessed well. A paper indicator with lift 1 springs between rows, interpolating both top and height. Details share one grid cell and are **scrubbed**, not transitioned: opacity, a 14px rise and a `clip-path` media wipe all follow the same eased position as the indicator, so passing many items stays continuous. A jump crossfades its source straight into its target, and the items in between stay hidden. A sprite preview animates only while its detail is visible. The live item number is written by the engine into a childless span.
- **Reduced motion:** the stage stays. Plates, items and jumps land instantly, and every state change still shows.
- **Fallback:** below 1024x680, or whenever a section's content would overflow the stage (`data-fit="no"`), the same DOM becomes stacked paper panels under a sticky rail. Step buttons (Previous / Next) sit at the bottom left so the switcher keeps the corner.

### Direction: Mosaic (`/home-v2/mosaic`, `MosaicInstrument`)
*The board comes down the page: switching sections flips a field of white tiles.*
- **Tab tray:** sticky and recessed (the tray shadow) with three raised caps (gradient from paper to tile, cap highlight, lift 1). Each cap has a 30px icon well. The selected tab presses into the tray, and its icon well turns teal with white glyph. On mobile the tabs stack icon over label at 74px tall. Arrow keys, Home and End rove.
- **Panel:** one tile-face card (6px radius, hairline, lift 2). Resting content is plain HTML.
- **Transition:** a veil of square tiles (about 96px, 80px under 640px) is built over the visible panel and spreads from the pressed tab. Each tile's delay is its distance times at most 16ms (about 200ms total). Each tile flips 180 to 0 degrees about an axis perpendicular to its distance vector, under `perspective(860px)`, lifting `translateZ(16px)` and scaling 1.04 at edge-on. The flip easing is `springEasing(300, 24)`, a damped spring sampled into a CSS `linear()` curve so the compositor runs it. A shade layer under each tile peaks at `translate(9px, 16px)` while the tile is raised. Content swaps at 38% of the flip, while fully covered, timed off the animation timeline rather than timers. The panel height springs (190/26), then the tiles flip away (300ms, `cubic-bezier(.55,0,.3,1)`) in the same ripple. Reduced motion: a 160ms / 240ms crossfade.
- **Content:** Experience rows on a 44px / 17rem / 1fr grid with raised logo tiles. Projects are an accordion: the toggle is a raised plus cap that turns into a pressed teal minus, and the body opens with `grid-template-rows` 0fr to 1fr. Open source is a two-column hairline list. About has a recessed education callout with a teal icon.

### Direction: Prism (`/home-v2/prism`, `PrismInstrument`)
*The three sections are the three faces of a white triangular prism.*
- **Control bar:** sticky. A 46px **plan icon** (an equilateral triangle seen from above, with the front edge in teal and an eye dot) rotates live with the prism. Next to it are three squarish tabs (2px radius, tile face, lift 1). The selected tab presses into the well and its marker becomes a teal diamond.
- **At rest:** flat. The front face is in normal flow (honest height, crisp text), and the other two are hidden and inert.
- **Turn:** faces sit 120 degrees apart, each at `translateZ(W / 2√3)`. The turn runs on a spring (stiffness 140, damping 21), always the short way. Perspective is `max(1100px, 2.2W)`, and the prism is pushed back so its nearest edge stays on the picture plane (never magnified). The stage height blends between the two faces' measured heights, with a 6-degree dead band. Each face is shaded by Lambert against the upper-left light, using two solid layers driven by opacity only (white `lit` up to 0.6, shade `dim` up to 0.16), so content is never re-rasterized. The lift-3 shadow body scales to the prism's projected silhouette, with a radial contact shadow pushed 18px right. Focus moves to the new face's heading.
- **Direct manipulation:** a horizontal drag or swipe turns the prism by hand, with rubber banding (0.25) past one face and release velocity carried into the spring. Vertical movement stays native scroll (`touch-action: pan-y pinch-zoom`). On fine pointers, hovering near a side edge leans the prism 4 degrees toward that neighbor.
- **Faces:** Experience is a two-column role grid. Projects is a sticky index of picks (the selected one is a paper card with lift 2 and a teal diamond) next to a detail view (media on a recessed mat, title with a GitHub button, two-column overview and features, chips), with open source below a hairline. About has the body, a recessed education card and contact buttons. Each face ends with previous/next step buttons that rise to paper on hover.
- **Reduced motion:** turns jump straight to the target face, and a drag only commits after more than 48px.

### Shared content components
- **Chips:** `well` fill, slate text, 2 to 3px radius, 12.5 to 13px.
- **Feature bullets:** 6px rotated squares in pewter.
- **Logo tiles:** 44 to 56px raised paper squares, hairline, lift 1.
- **Repo buttons:** ghost buttons at 44px tall, with an arrow that nudges diagonally `(2px, -2px)` for outbound links.
- **Media:** 16:9 in a `well` letterbox with lift 2 (Stage, Mosaic), or on a recessed mat with a lifted image (Prism). Sprite previews pause under reduced motion and on hidden Prism faces.

## Do's and Don'ts

### Do:
- **Do** take every shadow from the shared tokens (`--hv-lift-1/2/3`, `--hv-press`) or build it on `rgb(var(--hv-shade) / a)` with positive x and y offsets.
- **Do** show selection by pressing the control into the `well` (inset shadow plus `translateY(1px)`), with teal only on its small marker or icon.
- **Do** keep board caps and wall voxels the same albedo, size and bevel. Let lift and shadow carry hover.
- **Do** animate with `springStep` / `runSpring` (or a spring sampled into `linear()`), and give every motion a reduced-motion path that keeps the end state.
- **Do** read native scroll rather than capturing it. Fall back to stacked panels whenever content would not fit the stage.
- **Do** prefix new classes `hv-` (or the direction prefix `hv-st-` / `hv-mo-` / `hv-pr-`), and scope page-level CSS with `:has(.hv-root)`.
- **Do** route "show me the work" through the `hv:section` event so the hero CTA works with any direction.

### Don't:
- **Don't** add bloom, glow or emissive highlights to the scene. On white they wash the tiles out (the loss ring at 0.2 opacity is the only emissive element).
- **Don't** tint the board to set it apart from the wall, or tint caps on hover.
- **Don't** use teal for decoration, headings or body links at rest. It means live or selected state.
- **Don't** render the legacy `tag` as an eyebrow or kicker above a heading.
- **Don't** use black shadows, shadows going up or to the left, or a second light direction.
- **Don't** apply anything here to `/`. `docs/DESIGN.md` governs the main site, and this branch is temporary.
- **Don't** treat the preview switcher as part of the design. It goes away with the branch.
