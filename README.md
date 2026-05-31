# Cody Portfolio Site

This is a local Next.js portfolio project for Cody J., built with the App Router, React, TypeScript project files, Tailwind CSS, and ESLint.

The current homepage renders the generated ASCII hero prototype. The visual design has intentionally not been redesigned in this setup pass.

## Install

Requires Node.js and npm.

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local URL printed by Next.js, usually `http://localhost:3000`.

## Build

```bash
npm run build
```

## Project Structure

- `src/app/page.tsx` renders the homepage.
- `src/app/layout.tsx` defines the root layout and metadata.
- `src/app/globals.css` contains global Tailwind imports and base page styles.
- `src/components/hero/AsciiHero.jsx` contains the generated ASCII hero component.

## Notes

The ASCII hero is currently a generated single-file prototype. It still injects a large CSS string inside the component with `dangerouslySetInnerHTML`; a later refactor should move those styles into `src/app/globals.css` or a dedicated hero stylesheet after the app baseline is stable.
