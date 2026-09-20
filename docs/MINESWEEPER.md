# Minesweeper hero

The portfolio uses one lazy-loaded Three.js canvas behind the entire hero. Its finite 16×16 / 40-mine board sits on the right at desktop widths and below the introduction on narrow screens. The board has no surrounding backing or frame: decorative cells continue its exact one-unit lattice and surface height at the perimeter, with depth variation gradually returning farther out. The background uses darker forest-green caps, 0.97 units wide on the one-unit lattice, with up to 1.75 units of recessed relief. Simple box proxies cast their shadows without repeating the visible bevel geometry in the shadow pass. Background hover lifts reach 0.48 units and reveal a soft sage glow beneath the caps. The glow shader excludes the board rectangle, and reduced motion disables this effect. Decorative voxels cover the viewport with overscan and react locally to pointer movement, including behind the introduction. Native HTML content and links remain above the scene.

Only two unlabeled counters and the thick yellow smiley disc appear above the board. The counters are beveled seven-segment geometry extruded 0.24 units batched into one instanced mesh; HTML outputs remain for accessibility and fallback. Timer changes explicitly request a render under reduced motion. The counters show remaining-mine estimate and elapsed seconds (display capped at 999). The disc is the reset control, with a transparent, focusable HTML button aligned to its projected position. Its classic expressions include smile, surprise, crossed-out eyes, and victory sunglasses. Gaze uses the cursor position relative to the disc with a larger bounded eye displacement; body movement remains restrained. Status announcements and instructions are available to assistive technology without visible toolbar text.

## Controls

- Primary click/tap reveals a covered tile or chords a revealed number.
- Secondary click flags. Simultaneous primary/secondary buttons or middle click chord without a separate flag action.
- Chording requires the adjacent flag count to match the revealed number. It opens covered, unflagged neighbors, including zero-region flood fill. Incorrect flags can cause a loss.
- Touch: hold 450ms to flag; two fingers pan and pinch between 1× and 2.8×. One-finger dragging retains native page scrolling and cancels a pending reveal. The zoomed board is clipped to its play area so it cannot cover portfolio links or its counters. Reset returns to the full board.
- Keyboard: one grid Tab stop; arrows, Home/End and Ctrl+Home/End navigate; Enter/Space reveals or chords; F flags. Tab to the disc and Enter/Space resets. Keyboard navigation restores the full-board view after zoom.

## State and rendering

`game.mjs` owns immutable synchronous rules. Generation is deferred until first reveal, excluding the clicked cell and valid neighbors. Chords resolve as one revision, independent of visual staggering. Win/loss locks actions and stops the timer. Reset clears animation buffers with a generation counter; there are no delayed gameplay callbacks.

`publicBoard()` gives the renderer only visible information. Hover and buddy reactions never consult hidden mine locations.

`world.js` instances beveled caps, floors, number glyphs, flag assemblies, surrounding wall blocks, and a bounded 48-fragment pool. Decorative wall coverage is regenerated on viewport resize. Fixed-plane picking stays stable during hover and reveal motion. Local springs, outward reveal timing, reset reconstruction, and explosion waves run outside React.

`runtime.js` projects the board into a layout anchor while drawing across the full header. The camera starts directly facing the wall. Pointer parallax has equal horizontal and vertical strength (2.5 units at full pointer travel); native scrolling changes the viewpoint modestly. Hovering/pressing the board or using keyboard focus holds the camera steady. Pointer movement releases keyboard-only camera locks. Reduced motion removes continuous rendering and large movement; input still redraws. Offscreen/hidden rendering pauses and resumes with a bounded delta.

The pipeline uses SRGB output, ACES filmic tone mapping, a supported HDR composer target with up to 4× MSAA, SMAA fallback, and 0.1-strength highlight bloom. There is one 1024px low-intensity PCF shadow map. DPR caps are 1.4 desktop and 1.25 narrow screens, with an additional 1.6-million-pixel drawing-buffer budget for the full header. These are fixed conservative caps, not an FPS-based controller. No new dependencies were required beyond Three.js already present in the working tree.

WebGL failure leaves a functional HTML board and smiley reset. Without JavaScript, HTML portfolio content and a static board remain. Sound is omitted. Scene resources, observers, events, timers and render targets are disposed on teardown.

## Development and review

Development seed: 7319. Production seeds use browser cryptographic randomness. Development-only `window.__mines` exposes `state()`, `action(type,index)`, `reset()`, `freeze(boolean)`, and `project(index)`. Freezing also disables exaggerated movement for repeatable state screenshots. Production does not expose this hook.

`canvas.minesStats` reports physical drawing size, requested and actual MSAA samples, draw calls, triangles, camera offsets, touch zoom/pan, and render activity. Configuration separates geometry, springs, waves, light, buddy and camera parameters.

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. See [review evidence](minesweeper/REPORT.md).

## Cleanup

Removed the abandoned sakura and ASCII scenes, dedicated tree/terrain/wind/petal utilities, posters, reference image/video, generation script, obsolete tests and documentation. Shared seeded randomness and highlight bloom remain; Three.js and Framer Motion are still used. Portfolio content, project media, résumé and unrelated assets are preserved. Git history is unchanged.



