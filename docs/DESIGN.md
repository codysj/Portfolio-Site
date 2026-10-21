---
name: Cody Jung Portfolio, White Relief
description: A light, matte single-page portfolio. A playable 3D Minesweeper relief, lit white by one upper-left lamp, opens onto a Scroll Stage of sliding paper plates for Experience, Projects & Open Source and About.
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
  headline:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 2.3vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  section-label:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.3vw, 2.2rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title-project:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.8vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  item-title:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, .5rem + 1.6vh, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.008em"
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
    lineHeight: 1.62
  row:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 600
    lineHeight: 1.25
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
  disc: "50%"
spacing:
  gutter: "clamp(16px, 4.5vw, 86px)"
  peek: "76px"
  max: "1320px"
  spine: "56px"
  scroll-unit: "50svh"
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
  button-repo:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "44px"
  button-step:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "44px"
  button-step-disabled:
    textColor: "{colors.ink-muted}"
  social-link:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "10px"
    size: "40px"
  chip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.chip}"
    rounded: "{rounded.sm}"
    padding: "3px 9px"
  badge-company:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  rail-tab:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "50px"
  rail-tab-current:
    textColor: "{colors.ink}"
  stage-plate:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
  stage-spine:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink-secondary}"
    width: "56px"
  stage-spine-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  list-well:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.md}"
    padding: "6px"
  list-indicator:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sm}"
  list-row:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.row}"
    padding: "7px 12px"
    height: "50px"
  logo-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    size: "48px"
  edu-callout:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "20px 22px"
---

# Design System: Cody Jung Portfolio, White Relief

> **Scope.** This is the design system for the home page at `/`: `src/app/page.tsx` renders `HomeV2Shell` (`src/components/home-v2/`) with the white Three.js hero (`hero/`) and the Scroll Stage (`directions/stage/`). `/home-v2` now redirects to `/`. Classes are prefixed `hv-` (Stage: `hv-st-`, board: `hv-ms-`), and page-level overrides are scoped with `html:has(.hv-root)`. The 404 page still renders the retired dark `ah-` styles from `src/components/hero/hero.css`. It is not part of this system.

## Overview

**Creative North Star: "The White Relief"**

The whole page is one matte white surface lit by a single lamp in the upper left. Things are told apart by height, not by color: the Minesweeper board is made of the same white tiles as the wall around it, so the only way you see the board is the relief and the shadows it casts. Everything below the hero follows the same rule. Controls sit raised like unrevealed tiles, the list of roles and projects is a recessed well like a revealed cell, the live row is a white cap riding in that well, and every shadow falls down and to the right.

The content is light and editorial: one sans family, cool graphite ink on cool off-white, plenty of room around it. Motion is physical and quiet. Values follow damped springs (`springStep` in `motion.js`), hover lifts are a pixel or two, and the one large moment, paper plates sliding out from their spines as you scroll, reuses the same one-light model. Color is held back. One deep teal marks live state. Coral and yellow appear only as game meaning (flags, loss, the reset smiley).

Experience, Projects & Open Source, and About live in one instrument, the Scroll Stage, inside `main#work`. Native scroll drives it; it never captures the wheel. The brass, dark "workbench" look of the previous site was explicitly rejected and is not a reference.

**Key Characteristics:**
- A light, matte relief world: the hero's playable 16x16 board is lit white and sits flush in a white voxel wall.
- One upper-left light source, shared by the Three.js key light and every CSS shadow.
- Depth comes from relief: raised caps, recessed wells, pressed states. Fills and borders do very little.
- A single teal accent for live state only. No gradients as decoration, no glow, no bloom.
- Spring physics for every animated value, with a reduced-motion path that keeps the feedback and drops the motion.

## Colors

The palette is cool, low-chroma neutrals graded by height, plus one teal for live state and a small set of game colors.

### Primary
- **Deep Lagoon Teal** (`accent`): the only live-state color. It marks the current rail tab (its fill bar and rotated-square marker), focus rings, the 3D focus ring on the board, the topbar status dot, the caret, and the company badge text (for example "YC W25"). 5.4:1 on ground.
- **Teal Wash** (`accent-wash`): text selection, and the company badge background.

### Neutral (graded by height, lowest to highest)
- **Recessed Well** (`well`): revealed cells, the Stage list wells, chips, the education callout, the media letterbox.
- **Ground** (`ground`): the page, the wall's far field, the browser scrollbar track, and the sticky rail band in the stacked layout, so pinned controls read as part of the floor.
- **Tile Face** (`tile`): raised surfaces: ghost and repo buttons, step buttons, Stage spines, fallback board caps.
- **Paper** (`paper`): the highest surface: Stage plates, the sliding list indicator, logo tiles, the spine on hover.
- **Graphite Ink** (`ink`): headings, the primary button fill, past-section rail fills, 3D counter numerals. 15.5:1 on ground.
- **Slate** (`ink-secondary`): body and secondary text, the quiet section label on the stage, flag poles. 8.9:1 on ground.
- **Pewter** (`ink-muted`): periods, item counters, group labels, idle rail tabs, diamond bullets, the scroll cue. 5.4:1 on ground.
- **Hairline / Hairline Strong** (`line`, `line-strong`): dividers, button and logo outlines, the rail track.
- **Shadow Tone** (`shade`): never used as a fill. It is the RGB triplet (`--hv-shade: 32 40 44`) behind every shadow, used as `rgb(var(--hv-shade) / a)`, so shadows are cool grey, never black.
- **Scrollbar Thumb** (`scrollbar-thumb`): the page scrollbar, over the ground track.

### Game semantics (the hero board only)
- **Signal Coral** (`coral`): flags, the hit cap, loss fragments and the loss ring. **Wrong-flag Red** (`wrong-mark`) is the X on a wrong flag. **Loss Blush** (`loss-cell`) is the hit cell on the fallback board.
- **Buddy Yellow** (`buddy-yellow`): the smiley reset disc, the only saturated object in the scene.
- **Count inks** (`count-1` to `count-8`): classic Minesweeper number hues pushed dark enough to read on white, drawn into a canvas glyph atlas.
- **Scene values** (`scene-clear`, `scene-tile`, `scene-socket`): the WebGL clear color, the cap and wall albedo, and the flag socket.

### Named Rules
**The One Teal Rule.** Teal means "this is live or selected" and nothing else. If it is not the current section, focus, the status dot, or the small company badge, it is not teal.

**The Seamless Board Rule.** Board caps and wall voxels share one albedo (`scene-tile`), one size (0.95) and one bevel (0.05). Caps never tint on hover. Lift and shadow carry the affordance. The only cap that changes color is a hit mine (coral).

**The Cool Shadow Rule.** Every shadow is `rgb(var(--hv-shade) / a)` at 0.08 to 0.30 alpha. Never pure black, never warm.

## Typography

**Display Font:** Albert Sans (via `next/font/google` in `src/app/page.tsx`, exposed as `--hv-font`, with `system-ui, sans-serif` fallback)
**Body Font:** Albert Sans
**Label/Mono Font:** none. Numbers use tabular figures (`font-variant-numeric: tabular-nums` on the root).

**Character:** One geometric-grotesque family carries everything, with tight negative tracking at display sizes and plain, generous body text. Weight 600 does the work. Italic appears only as the `em` segment in the hero headline.

### Hierarchy
- **Display** (`display`): the hero h1 only, max 15ch, balanced wrap, the greeting segment on its own line. Steps to `clamp(2.4rem, 6.5vw, 4rem)` at 1000px and below, and `clamp(2.2rem, 9.4vw, 3rem)` at 600px and below.
- **Headline** (`headline`): the section h2 in the stacked layout.
- **Section label** (`section-label`): the same h2 on the pinned stage, demoted to a quiet slate label because the rail and spines already name the section. Company and project names carry the display step there.
- **Title** (`title`): the company name in an Experience detail on the stage (`clamp(1.35rem, 2vw, 1.9rem)` when stacked).
- **Title, project** (`title-project`): project names and the Open Source heading. 1.4rem on compact stages.
- **Item title** (`item-title`): open-source names (scaling to `clamp(1.3rem, .6rem + 1.3vh, 1.6rem)` on the stage).
- **Lead** (`lead`): the Experience summary on the stage, max 52ch. The About body runs larger on the stage (`clamp(1.4rem, .7rem + 1.8vh, 2rem)`, 1.5). Stacked, both drop to about 1 to 1.3rem at 1.62 to 1.68. The hero subline is `clamp(.95rem, 1.08vw, 1.04rem)` at 1.7, max 48ch.
- **Body** (`body`, `body-small`): role lines, taglines, overviews and feature lists at 14.5 to 16px, about 1.5 to 1.6, max 52 to 64ch.
- **Row** (`row`): company and project names in the list well, with a 12.5px pewter period under each company.
- **Label** (`label`): rail tabs, topbar, periods, item counter, spine labels (13 to 14px, 500 to 600). Never uppercase.
- **Chip** (`chip`): tech chips and the company badge (12 to 12.5px).
- **Counter** (`counter`): the HTML fallback for the mine and time counters. In WebGL these become extruded seven-segment numerals.

### Named Rules
**The No Kicker Rule.** No eyebrow label above a heading. The legacy `tag` metadata in `content.js` is never rendered. The hero focus areas sit *below* the headline, separated by small rotated squares.

**The Sentence Case Rule.** Labels, tabs and buttons are sentence case at weight 600. Hierarchy comes from size and weight, not caps or tracking.

## Layout

- **Root tokens:** side gutter `gutter`, content max width `max`, and a `peek` of 76px. The hero is `100svh - 76px` tall, so the top of the instrument always shows at the fold.
- **Hero:** a two-column grid (`.85fr` copy / `1.25fr` board), gap `clamp(26px, 3vw, 58px)`, top padding 100px for the absolute topbar (brand left, status right). The WebGL scene fills the whole header behind both columns. A left-to-right ground veil (0.94 to transparent by 72%, plus a bottom fade into the ground) keeps the copy at AA contrast over the wall. At 1000px and below it becomes a single column: copy (max 720px) above a board anchor of `clamp(390px, 95vw, 730px)`, and the veil turns vertical.
- **Board anchor:** `clamp(470px, 100svh - 160px - peek, 740px)` tall. The camera fits the 16x16 board plus the counter row into it.
- **Scroll Stage, pinned** (at least 1024 wide and 680 tall, when every section fits): a tall track of `100svh + units x scroll-unit` holds a sticky full-viewport stage. Inside it, top to bottom: the rail (three equal tabs on one hairline), the deck (flex 1, a size container), and a 76px foot with the step buttons on the left. The deck lays three plates edge to edge; inactive plates fold to 56px spines. Section bodies are two-column grids: a list well (`minmax(250px, 300px)` for Experience, `minmax(210px, 250px)` for Projects) beside the detail cell, gap `clamp(28px, 3.6vw, 64px)`. At 1400px wide or 860px tall and below, the stage compacts: shorter rail and foot (46px, 64px), tighter plate padding, a narrower project list and smaller project type.
- **Scroll Stage, stacked** (below the threshold, or `data-fit="no"` when any detail would overflow its plate): the same DOM becomes paper panels 20px apart under a sticky rail on a ground band. The rail is `1fr / 1.7fr / .7fr` below 900px, equal thirds above, and "Projects & Open Source" shortens to "Projects" below 600px. Details stack in reading order with 28px hairline separators (24px at 600px and below). Projects reorder on phones (title and tagline, then media, then the long read) and become a two-column grid from 720px.
- **Footer:** a hairline top border, max 1320px, 40px over 88px of padding.
- **Breakpoints in use:** 600 (599), 700 (scene DPR and shadow size), 720, 900, 1000, 1024x680 (the stage threshold), and 1400 or 860-tall (stage compaction).
- **Touch targets:** 44px minimum on rows, repo, step and contact links, 48px on hero CTAs, 40px on social icons, 50 to 52px on rail tabs.

## Elevation & Depth

This system uses real shadows with one direction of light. Light comes from the upper left, so every shadow is offset down and to the right with a soft blur, and a press is an inset shadow from the same direction. Surfaces step up from `well` to `ground` to `tile` to `paper`, and the shadows confirm the height.

### Shadow Vocabulary
- **Lift 1** (`--hv-lift-1`: `1px 1px 2px rgb(shade/.14), 2px 4px 10px rgb(shade/.08)`): resting raised controls: buttons, step buttons, logo tiles, the list indicator.
- **Lift 2** (`--hv-lift-2`: `1px 2px 3px rgb(shade/.16), 4px 10px 22px rgb(shade/.12)`): hover on raised controls, stacked panels, resting stage plates, project media.
- **Plate in flight** (engine-written): Lift 2 whose outer layer grows with `fly` (0 at rest, 1 mid-slide) to `12px 18px 44px` at 0.19 alpha, so a moving plate's edge throws a deeper shadow onto its neighbor.
- **Press** (`--hv-press`: `inset 1px 2px 3px rgb(shade/.18)`): button `:active` (80ms), list wells, the education callout.
- **Rail band** (`0 10px 14px -14px rgb(shade/.5)`): the stacked sticky rail, a thin shadow line under the floor-colored band.
- **Marker** (`1px 2px 3px rgb(shade/.3)`): the current rail tab's teal diamond.
- **Buddy** (`2px 3px 6px rgb(shade/.22), 6px 10px 22px rgb(shade/.14)`): the fallback smiley disc.
- `--hv-lift-3` is defined on the root but not used on this page.

### The hero scene (Three.js)
The hero is a real-time WebGL relief (`hero/minesweeper/runtime.js`, `world.js`, `config.js`, `pipeline.js`):

- **Renderer:** `WebGLRenderer`, sRGB output, **Neutral tone mapping** at exposure 1, clear color `scene-clear`. DPR is capped at 1.4 on desktop and 1.25 under 700px, with a 1.6M-pixel budget.
- **Camera:** an orthographic camera at z=32 that always looks at the origin. Its position drifts with the pointer (parallax 2.5) and scroll (2.4) through an exponential ease, and is frozen under reduced motion or while the user is interacting with the board.
- **Lights:**
  - `HemisphereLight`, white sky over a cool grey ground (`#c3cbc8`), intensity 1.6: the ambient lift that keeps the white from going grey.
  - Key `DirectionalLight` in warm white (`#fffaf2`), intensity 2.5, from `(-9, 11, 13)` normalized to distance 60. The upper-left lamp and the only shadow caster: map 2048 (1024 under 700px), `normalBias 0.02`, `bias -0.0004`, `radius 4`, **`shadow.intensity 0.82`** so shadows never go fully dark. The shadow frustum is resized to the visible wall on every resize.
  - Fill `DirectionalLight` in cool `#e8eef2`, intensity 0.55, from the lower right `(9, -3, 10)`. No shadow; it only softens shadowed sides.
- **Materials:** `MeshStandardMaterial`, roughness 0.7, metalness 0.025. Matte, no specular sheen.
- **Geometry:** board caps are `RoundedBoxGeometry` (0.95 x 0.95 x 0.43, bevel 0.05). Revealed floors are thin recessed slabs (0.94 x 0.94 x 0.08) in `well`. The wall uses the same lattice: flush at the board edge, then relief builds outward through `smoothstep(..., 0, 4)` to up to 1.5 units of seeded depth, with a per-voxel shade of 0.975 to 1.0.
- **Post:** `EffectComposer` with a RenderPass, then **SMAA only if MSAA (up to 4x) is unavailable**, then OutputPass. HalfFloat targets when `EXT_color_buffer_float` is available. **No bloom**: on a white field any halo washes the tiles out.
- **Depth motion:** hovered caps lift 0.19 (neighbors 0.065) on a spring (stiffness 145, damping 20), and a press sinks 0.13. Wall voxels near the cursor rise up to 0.48. Reveals stagger outward from the clicked cell (up to 0.34s). Loss, win and reset send a radial wave (speed 10, width 1.4) through caps and wall; loss adds 48 coral fragments and a faint coral ring.

### Named Rules
**The Single Lamp Rule.** One light, upper left, everywhere: CSS shadow offsets are always zero or positive x and positive y, and the 3D key light is the only shadow caster.

**The Raised Means Available, Recessed Means Chosen Rule.** An actionable control is a raised cap (tile or paper with lift). The list that holds a choice is a recessed well, and the current choice is the white cap riding inside it. Selection is never a color fill alone.

## Shapes

The corners are small and squarish, like machined tiles: 2px for focus outlines and fallback board cells, 3px for buttons, chips, media, the list indicator and the education callout, and 4px for plates, logo tiles, list wells and social-link hovers. The only circle is the buddy disc. The recurring motif is the **rotated square**: the topbar status dot, the hero focus separators, diamond feature bullets, the spine marker (a diamond that flattens to a square as its plate is covered), and the rail marker (an outlined square, filled when past, a teal diamond when current). The board's 3D focus ring is a four-segment torus, the same diamond.

## Components

### Shell (`HomeV2Shell`)
*A quiet frame around one loud object.* It renders the hero, then `main#work` holding the Scroll Stage, then the footer. Root tokens live on `.hv-root` (`isolation: isolate`, `overflow-x: clip`). Focus is a 2px teal outline offset 3px. Links underline at 0.22em offset, 1px thick; footer and contact links reveal the underline on hover.

### Buttons
- **Shape:** gently squared (3px), 1px border, 48px tall in the hero, 44px in the stage.
- **Primary:** graphite fill, white text, an arrow that slides 3px on hover. Used for "View Selected Work" in the hero and the resume link in About.
- **Ghost / Repo:** tile face with a hairline border. Repo buttons carry a GitHub mark, "View on GitHub" and a trailing arrow.
- **Hover / Active:** lift -2px to Lift 2 on hover; on `:active` they drop back and press (80ms). Transitions run 420ms on the exponential ease-out.
- **Step (Previous / Next):** tile face, Lift 1, -1px and Lift 2 on hover with the arrow nudging 2px outward. Disabled steps go flat and pewter.

### Chips and badge
- **Chips:** `well` fill, slate text, 3px radius, 12.5px at 600.
- **Company badge:** teal on teal wash, 12px, inline after the company name (for example "YC W25").

### Hero (`HeroContent`, `Minesweeper`)
- **Copy:** brand and status topbar (status after a teal rotated-square dot), the h1, focus areas joined by rotated squares, the subline, a row of 40px social icons (hover: ink, a 6% shade wash, -1px), then CTAs. The entrance is a staggered `hv-fadeup` (14px rise, 0.9s, ease-out-expo) with delays from 0.05s to 0.8s, plus a pulsing scroll cue.
- **CTAs:** the primary button scrolls to `#work` and fires the `hv:section` event with `"projects"`; the Stage jumps to Projects. The ghost button links to the resume.
- **Board:** the WebGL scene described under Elevation. HTML `output` counters and the yellow smiley button are positioned over the projected 3D points and become transparent once the scene is live (`.hv-ms-live`). Game rules come unchanged from `game.mjs`. The fallback board (no WebGL) is CSS: tile caps with an inset highlight and a down-right shadow, revealed cells recessed in `well`, SVG marks. Keyboard: arrow keys, Home/End, Enter/Space, F. Touch: tap, hold to flag, two-finger pan or zoom.

### Scroll Stage (`ScrollStage`)
*Scroll moves you through it, like a slide deck that lives in the page.*
- **Timeline:** native scroll position is read, never captured, and mapped to units of half a viewport (`scroll-unit`). Each list item holds one unit (Projects counts Open Source as one more item), and each section change spends half a unit. A critically damped spring (stiffness 170, damping 26) chases the scroll target. One proximity scroll-snap point per stop gives every rest state a settled plate, never two plates half-slid.
- **Engine:** one engine owns every moving value. Each frame it writes inline styles on only the dozen elements that move, and only when a value changed. It never writes an inherited custom property, so the deck is not restyled per frame. React state (`aria-current`, `inert`, step buttons) commits only when motion comes to rest. The live item number is written by the engine into a childless span.
- **Deck:** three paper plates laid edge to edge in a descending z-order, so each plate casts its shadow onto its right-hand neighbor. Inactive plates fold to 56px spines (tile face, vertical label, a square marker). On a section change, the next plate slides out from its spine while the covered one fades and recedes 10% of the deck width. During the last item of a section, the next plate peeks out 6% as a hint. Clicking a spine jumps to that section.
- **Rail:** three tabs on one hairline. Each fill bar scales with progress through its section, graphite for past sections and teal for the current one.
- **List well:** a recessed well of rows. A paper indicator with Lift 1 interpolates top and height between rows, dwelling on each item and moving through the last 30% of its unit. Details share one grid cell and are **scrubbed**, not transitioned: opacity, a 14px rise and a `clip-path` media wipe all follow the same eased position as the indicator, so passing many items stays continuous. Sprite previews play only while their detail is live.
- **Jumps:** a clicked rail tab, spine, row, step button or the hero CTA runs one eased (cubic in-out) scroll lasting `min(900ms, 380ms + 150ms x sqrt(units))`. Snap is suspended while it runs, the spring is bypassed, and wheel, touch or key input cancels it. A jump crossfades its source straight into its target; the items in between stay hidden.
- **Details:** Experience shows a 56px logo tile, the company (`title`) with an optional badge, the role, a `lead` summary, and the period on a hairline at the plate floor. Projects show the text column beside a side column of 16:9 media in a `well` letterbox (Lift 2), chips and a repo button. Open Source is two hairline columns with repo buttons on the floor. About pairs the large body with a recessed education callout, the resume button and contact links.
- **Accessibility:** only the active plate's content is in the tab order on the stage (`inert`). Rows set `aria-current` and `aria-controls`; the counter has a screen-reader "Item n of N".
- **Reduced motion:** the stage stays. Plates, items and jumps land instantly, and every state change still shows. Sprite previews stop.
- **Fallback:** the stacked layout under Layout, with the rail fill following each panel past mid-viewport and rail clicks smooth-scrolling to the panel.

### Footer
Footer text left, a links nav right, 15px. Links are slate at 500 and turn ink with an underline on hover.

## Do's and Don'ts

### Do:
- **Do** take every shadow from the shared tokens (`--hv-lift-1`, `--hv-lift-2`, `--hv-press`) or build it on `rgb(var(--hv-shade) / a)` with positive x and y offsets.
- **Do** show a choice as a raised white cap inside a recessed well, with teal only on small markers, fills and focus.
- **Do** keep board caps and wall voxels the same albedo, size and bevel. Let lift and shadow carry hover.
- **Do** animate with `springStep` / `runSpring`, and give every motion a reduced-motion path that keeps the end state.
- **Do** read native scroll rather than capturing it, and fall back to stacked panels whenever content would not fit the stage.
- **Do** write per-frame motion as inline styles on the elements that move, never as an inherited custom property on a large subtree.
- **Do** prefix new classes `hv-` (Stage `hv-st-`), and scope page-level CSS with `:has(.hv-root)`.
- **Do** route "show me the work" through the `hv:section` event.

### Don't:
- **Don't** add bloom, glow or emissive highlights to the scene. On white they wash the tiles out (the loss ring at 0.2 opacity is the only emissive element).
- **Don't** tint the board to set it apart from the wall, or tint caps on hover.
- **Don't** use teal for decoration, headings or body links at rest. It means live or selected state.
- **Don't** render the legacy `tag` as an eyebrow or kicker above a heading.
- **Don't** use black shadows, shadows going up or to the left, or a second light direction.
- **Don't** bring back the brass, dark "workbench" look of the previous site.
