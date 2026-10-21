# Cody Portfolio Site

A Next.js portfolio with a playable 3D Minesweeper hero, re-lit as a white relief, and one scroll-driven stage that moves through Experience, Projects & Open Source, and About. The introduction, sections, and contact links remain ordinary HTML. The Three.js scene loads separately. Résumé links use `/resume`, which redirects to the current PDF at `/resume.pdf`.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
npm start
```

## Structure

- `src/data/portfolio.js`: portfolio content and links.
- `src/app/page.tsx`: the home page (`HomeV2Shell` + `ScrollStage`).
- `src/components/home-v2/`: the shell, tokens (`home-v2.css`), motion helpers, and the white-relief Three.js hero (`hero/`).
- `src/components/home-v2/directions/stage/`: the Scroll Stage that combines Experience, Projects & Open Source, and About.
- `src/components/hero/minesweeper/game.mjs`: pure game rules shared by the hero. The rest of `src/components/hero/` is the previous dark home page, no longer routed; its stylesheet still styles the 404 page and its `ExperienceIcon` / `ProjectMedia` components are reused.
- `src/lib/three/HighlightBloomPass.js`: shared selective-highlight bloom pass.
- `tests/minesweeper.test.mjs`: independent game-rule checks.

See [scene architecture and controls](docs/MINESWEEPER.md), [visual guidelines](docs/DESIGN.md), and [verification evidence](docs/minesweeper/REPORT.md).

The project uses Next.js 15.5, React 18, and Three.js r186 directly. It does not need a React Three Fiber wrapper. Framer Motion remains in use by the portfolio sections. PostCSS remains pinned through npm overrides.
