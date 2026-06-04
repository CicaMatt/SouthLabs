# SouthLabs

Marketing site for **SouthLabs**, an Italian IT‑consulting firm. A single‑page React
app with a custom animated hero (particle field + factory illustration) and a bespoke
section‑grid interaction layer (a custom cursor, click/tap grid bursts, and card
highlights). Content is in Italian.

## Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, configured in `src/tailwind.css`)
- **ESLint 9** (flat config) + **Prettier**
- No runtime dependencies beyond React; the contact form posts to **Formspree**.

## Getting started

Requires **Node 20+**.

```bash
npm ci          # install exact dependencies
npm run dev     # start the Vite dev server
```

## Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Start the dev server.                                   |
| `npm run build`        | Production build to `dist/`.                            |
| `npm run preview`      | Preview the production build (serves security headers). |
| `npm run lint`         | ESLint (`--max-warnings=0`).                            |
| `npm run format`       | Format with Prettier.                                   |
| `npm run format:check` | Check formatting without writing.                       |
| `npm run check`        | Lint + format check + build (the full gate).            |

## Project structure

```
src/
  main.jsx, App.jsx          App entry and composition
  lib/                       Pure, framework-agnostic primitives (no React, no domain)
    math · geometry · color · dom · classNames
  features/
    hero/                    Animated hero: particle field, factory SVG + geometry,
                             and the hero interaction hooks
    sectionGrid/             Section-grid interaction layer (cursor, bursts, touch,
                             pinch guard) — entry point hook is useSectionGridInteractions.js
  components/
    ui/                      Shared building blocks (SectionShell, SectionHeader)
    layout/                  TopNavBar, Footer
    sections/                The six page sections + cardSurface styling helpers
  styles/                    CSS modules, imported via styles.css; class names are the
                             contract with the JS interaction layer
  privacy/                   Legal documents (loaded as raw HTML)
```

### Architecture notes

- **`lib/` vs `features/`** — `lib/` holds reusable primitives shared across features
  (math, geometry, color, DOM helpers). Each `features/*` folder co‑locates a
  self‑contained interactive subsystem (its components, hooks, and logic).
- **Shared factory geometry** — the factory illustration's collision shapes live once in
  `features/hero/factoryGeometry.js`; both the particle exclusion and the cursor hit‑test
  import them.
- **CSS contract** — Tailwind utilities plus hand‑written modules under `styles/`. Class
  names and DOM selectors are a deliberate contract between the CSS and the JS
  interaction layer (see `features/sectionGrid/domSelectors.js`); rename on both sides.
- **Performance & motion** — animations are tuned to stay on the compositor and respect
  `prefers-reduced-motion`; the hero caps work on high‑refresh displays and pauses
  off‑screen. The accompanying comments explain the deliberate complexity.

## Deployment

- **Vercel** via `vercel.json`; the same security headers are mirrored in
  `public/_headers` and in the Vite preview server. The Content‑Security‑Policy allows
  Google Fonts and Formspree only.
