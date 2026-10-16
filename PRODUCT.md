# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and engineering managers screening Cody Jung for Summer 2027 software engineering and applied-AI internships. They typically arrive from the résumé, LinkedIn, or GitHub and give the site a short skim, deciding quickly whether Cody is worth a conversation.

## Product Purpose

A personal portfolio that presents Cody as a UC Berkeley Computer Science + Business student who builds reliable AI applications and data-intensive software. A visit succeeds when the visitor **reaches out** (email or LinkedIn) and **remembers Cody** among the other candidates they reviewed.

## Positioning

AI software held to deterministic checks, explicit failure boundaries, and measured outcomes, combined with a playable 3D Minesweeper hero that makes the site memorable. The work itself (contract roles at Google and AfterQuery, an internship at Matrix Power, a co-founded product serving 7,600 users) is the proof; the site exists to surface it quickly.

## Operating Context

- Visitors move between the site, the résumé PDF, LinkedIn, and GitHub repos. All of them must stay one click away.
- Desktop and mobile both matter. On narrow screens the Minesweeper board sits below the introduction and supports touch pan/zoom.
- Content is edited in one place, `src/data/portfolio.js`, and comes from Cody's current résumé.

## Capabilities and Constraints

- Next.js 15 (App Router), React 18, Three.js r186 used directly (no React Three Fiber), Framer Motion in the content sections, Tailwind/PostCSS.
- One scrolling page: hero, Selected Experience, Projects (expandable cards with media), Open Source, About, footer. `/resume` redirects to `/resume.pdf`. There is also a themed 404 page. No further routes are planned.
- The Minesweeper hero is optional and lazy-loaded. The intro, navigation, and content stay ordinary HTML that works without it. Game rules (`game.mjs`) stay separate from presentation and are covered by `tests/minesweeper.test.mjs`.
- Status line: "Seeking Summer 2027".

## Brand Commitments

- Name: Cody Jung. Voice: calm, direct, specific, first person, with concrete numbers instead of adjectives.
- The playable Minesweeper hero is the site's signature and stays.
- The site stays one scrolling page plus `/resume`.

## Evidence on Hand

- Experience, project, open-source, and education content with metrics: `src/data/portfolio.js`.
- Résumé: `public/resume.pdf`.
- Project media (posters, demo sprites, SVG): `public/projects/`.
- Minesweeper implementation notes and review captures: `docs/MINESWEEPER.md`, `docs/minesweeper/`.
- **Absent:** testimonials, endorsements, client quotes, and press. Never invent them.

## Product Principles

1. Get to the proof fast: a skimming recruiter should see role, focus, and the strongest work within seconds.
2. Contact is always close: email and LinkedIn are reachable from every section.
3. Memorable, never in the way: the hero earns recall but never blocks reading, scrolling, or links.
4. Claims stay factual: every number and claim comes from real work in `portfolio.js` and the résumé.

## Accessibility & Inclusion

Existing implemented requirements that future work must keep: the game is fully playable by keyboard through a single-entry grid; reduced motion keeps all game-state feedback; native page scrolling (including one-finger drag on touch) is never captured by the hero; HTML content stays stable during scene effects; there is a non-WebGL fallback.
