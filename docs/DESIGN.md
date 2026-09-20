# Portfolio visual guidelines

The portfolio combines Newsreader display typography with IBM Plex Mono details. Keep content calm, direct, and accessible. Preserve project links, résumé access, navigation, and the existing expandable project cards.

The hero is an optional 3D Minesweeper playground: a finite sage board set into a dark green voxel wall. The introduction occupies the left side at desktop widths. Below 1000px the complete board appears below the introduction, with in-place touch pan/zoom.

Use softly beveled solid geometry, warm diffuse light, restrained shadows, coral flags, colored numbers, and a thick yellow disc companion. Avoid glass, noisy textures, continuous orbiting, flashing overlays, and decorative motion that competes with reading.

The voxel wall fills the entire header. Show only unlabeled mine/time counters and the reset disc above the board. Keep HTML content stable during world effects. Native page scrolling remains available with one-finger dragging. Controls must work without a mouse, and reduced motion must retain all game-state feedback. Do not introduce a second game input system without preserving the single-entry keyboard grid.

Scene parameters live in `src/components/hero/minesweeper/config.js`. Keep game rules independent from presentation, and never pass a hidden mine layout to the renderer or companion. See [implementation notes](MINESWEEPER.md) and [review evidence](minesweeper/REPORT.md).
