# Cody Portfolio Site

A Next.js portfolio with an optional, playable 3D Minesweeper hero. The introduction, navigation, résumé, project gallery, and contact links remain ordinary HTML. The Three.js scene loads separately.

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
- `src/components/hero/HeroPage.jsx`: page composition.
- `src/components/hero/hero.css`: layout, typography, and shared palette.
- `src/components/hero/minesweeper/`: pure game rules, accessible React controls, and the lazy-loaded Three.js scene.
- `src/lib/three/HighlightBloomPass.js`: shared selective-highlight bloom pass.
- `tests/minesweeper.test.mjs`: independent game-rule checks.

See [scene architecture and controls](docs/MINESWEEPER.md), [visual guidelines](docs/DESIGN.md), and [verification evidence](docs/minesweeper/REPORT.md).

The project uses Next.js 15.5, React 18, and Three.js r186 directly. It does not need a React Three Fiber wrapper. Framer Motion remains in use by the portfolio sections. PostCSS remains pinned through npm overrides.
