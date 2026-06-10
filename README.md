# SouthLabs

Static, client-rendered React app built with **Vite** and **Tailwind CSS v4**.
The whole site is one scrolling page — a hero plus five content sections —
layered with a set of custom, hand-written interaction effects (an animated
"factory" hero illustration, a pointer-reactive particle field, a grid cursor
that re-themes per section, and a click-driven grid "burst" effect).

There is no backend: the only network call is the contact form, which posts
directly to [Formspree](https://formspree.io).

---

## Tech stack

| Concern         | Choice                                              |
| --------------- | --------------------------------------------------- |
| UI library      | React 18                                            |
| Build / dev     | Vite 5                                               |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`) + plain CSS    |
| Form delivery   | Formspree (no runtime dependency)                   |
| Linting / format| ESLint 9 (+ react, hooks, jsx-a11y), Prettier       |
| Hosting         | Static build (`vercel.json` + `public/_headers`)    |

Fonts (Manrope, Inter, Material Symbols) are loaded from Google Fonts. The
design palette is a Material Design 3 token set declared in
[src/tailwind.css](src/tailwind.css) (`--color-*`, `--font-*`), which is what
makes class names like `text-on-background` or `bg-tertiary-fixed` work.

---

## Getting started

```bash
npm install        # Node >= 20 required
npm run dev        # start the Vite dev server
npm run build      # production build into dist/
npm run preview    # serve the production build locally (with security headers)
npm run check      # lint + format check + build (use before committing)
```

---

## How the page is assembled

Rendering starts at [src/main.jsx](src/main.jsx), which mounts
[src/App.jsx](src/App.jsx) into `#root` (see [index.html](index.html)).

`App` is the composition root. It lays out the page top to bottom and wires up
the one site-wide interaction system:

```
App
├── TopNavBar                         (sticky header, mobile menu)
├── <main>  ◀── useSectionGridInteractions() attaches here
│   ├── HeroSection
│   ├── WebSolutionsSection
│   ├── SoftwareSection
│   ├── InfrastructureSection
│   ├── SupportSection
│   ├── ContactSection
│   ├── <canvas>   ◀── grid "burst" effect, viewport-fixed overlay
│   └── <div>      ◀── the custom section cursor dot
└── Footer                            (legal modals, social links)
```

Every content section is rendered through one shared wrapper,
[SectionShell](src/components/ui/SectionShell.jsx), so spacing, max-width,
the background grid, and the per-section theme all come from one place.

### Directory layout

```
src/
├── main.jsx, App.jsx          App entry + composition root
├── components/
│   ├── layout/                TopNavBar, Footer
│   ├── sections/              One file per page section + cardSurface helper
│   └── ui/                    SectionShell, SectionHeader (shared primitives)
├── features/
│   ├── hero/                  The animated hero illustration + particle field
│   └── sectionGrid/           Site-wide grid cursor + click-burst system
├── lib/                       Tiny framework-agnostic helpers (math, color, dom…)
├── styles/                    Plain CSS, organised by area; imported via styles.css
├── tailwind.css               Tailwind import + the design-token @theme block
└── privacy/                   Legal HTML, loaded raw into the footer modals
```

The split is deliberate:

- **`components/`** holds the visible structure (markup + Tailwind classes).
- **`features/`** holds the imperative, performance-sensitive interaction logic
  (canvas drawing, `requestAnimationFrame` loops, pointer math). These are
  packaged as custom React hooks that hand refs and event handlers back to the
  components.
- **`lib/`** holds pure, reusable helpers with no React or DOM-event knowledge.

---

## The three big interaction systems

Most of the code volume is in three self-contained effects. Each one lives in
`features/`, exposes a hook, and keeps its per-frame work off the React render
path (it mutates DOM/canvas directly via refs instead of triggering re-renders).

### 1. The section grid: cursor + burst (`features/sectionGrid/`)

This is the **site-wide** effect, owned by `App` via the
[useSectionGridInteractions](src/features/sectionGrid/useSectionGridInteractions.js)
hook. That hook is the single integration point — it returns `mainRef`,
`sectionCursorRef`, `burstCanvasRef`, and a bundle of pointer event handlers
that `App` spreads onto `<main>`. Internally it composes three smaller hooks:

- **`useSectionCursor`** — moves the custom cursor dot, and recolors it as the
  pointer crosses into a different section. Each section's color comes from the
  [sectionRegistry](src/features/sectionGrid/sectionRegistry.js) (`SECTION_CURSOR_THEMES`),
  keyed by the section's `id`. It also drives the faint background grid's
  cursor-following highlight.
- **`useSectionGridBurst`** — on click/tap it paints an expanding ring of grid
  lines on the fixed overlay `<canvas>`, tinted to the section and attenuated
  around cards. Rendering lives in
  [gridBurstCanvas.js](src/features/sectionGrid/gridBurstCanvas.js) (a single
  rAF loop drawing `fillRect`s — see the file header for why a canvas is used
  instead of CSS masks).
- **`useTouchGridGestures`** — distinguishes a tap from a scroll on touch
  devices so taps trigger a burst while scrolling does not.

[domSelectors.js](src/features/sectionGrid/domSelectors.js) is the contract
between this JS and the CSS/markup: it centralizes the class names and selectors
the interaction layer toggles and queries (e.g. `.solution-card-surface`,
`.section-grid-burst-disabled`). Keep it in sync with the CSS.

### 2. The hero illustration (`features/hero/`)

Owned locally by [HeroSection](src/components/sections/HeroSection.jsx) via the
[useHeroInteractions](src/features/hero/useHeroInteractions.js) hook. The hero
reacts to the pointer with: a parallax shift of the SVG factory, a soft
"hover light" that eases toward the cursor, and a brief animation speed-up on
click. The animated SVG itself is
[FactoryIllustration](src/features/hero/FactoryIllustration.jsx) (a decorative
factory + chart "plume"; its motion is driven by CSS in `styles/hero/`).

Two helper hooks keep it cheap:
[useFactoryFpsCap](src/features/hero/useFactoryFpsCap.js) caps the CSS
animations to ~60 fps on high-refresh displays, and
[useFactoryAnimationAcceleration](src/features/hero/useFactoryAnimationAcceleration.js)
ramps playback rate on interaction. The hero also pauses itself when scrolled
off-screen or when the tab is hidden.

### 3. The particle field (`features/hero/HeroParticleField.jsx`)

A `<canvas>` of drifting particles behind the hero that are repelled by the
pointer. The simulation is pure functions in
[particleField.js](src/features/hero/particleField.js); the component owns the
canvas, the rAF loop, and resize handling. It reads the same `pointerRef` that
`useHeroInteractions` writes to, and uses [factoryGeometry.js](src/features/hero/factoryGeometry.js)
to keep particles from drawing on top of the factory shape.

> **Shared pattern:** all three systems follow the same recipe — a hook owns
> imperative state in refs and a rAF loop, talks to the DOM/canvas directly, and
> returns only refs + handlers to the component. React renders the static
> structure once; the animation never re-renders it.

---

## The content sections

Each section is one file in [src/components/sections/](src/components/sections/),
rendered through [SectionShell](src/components/ui/SectionShell.jsx). `SectionShell`
takes a `variant` (`hero` / `web` / `software` / `infrastructure` / `support` /
`contact`) and resolves padding, width, the background grid, and CSS variables
for that section's theme. [SectionHeader](src/components/ui/SectionHeader.jsx) is
the shared title/subtitle block.

| Section                 | Anchor id                  | Content                                            |
| ----------------------- | -------------------------- | -------------------------------------------------- |
| `HeroSection`           | `#hero`                    | Headline, CTAs, animated factory + particles       |
| `WebSolutionsSection`   | `#siti-web`                | Web / e-commerce / WordPress solution cards        |
| `SoftwareSection`       | `#software-automazione`    | Software & automation / AI                         |
| `InfrastructureSection` | `#infrastrutture-hardware` | Hardware & infrastructure                          |
| `SupportSection`        | `#manutenzione-supporto`   | Maintenance & support                              |
| `ContactSection`        | `#contatti`                | Contact form (Formspree)                           |

The anchor ids matter: the nav links in
[TopNavBar](src/components/layout/TopNavBar.jsx) and the section themes in
[sectionRegistry.js](src/features/sectionGrid/sectionRegistry.js) both reference
them, so they must stay consistent across all three places.

Solution cards share their surface styling through
[cardSurface.js](src/components/sections/cardSurface.js), which exposes the
`.solution-card-surface` class and the CSS-variable style objects that drive
their background/hover tint — the same class the grid-burst logic detects.

### The contact form

[ContactSection](src/components/sections/ContactSection.jsx) is the only stateful
data flow. It POSTs a `FormData` payload to a Formspree endpoint. Notable bits:

- **Validation** uses native HTML constraints (`required`, `pattern`, `type`)
  but suppresses the browser's bubbles (`noValidate`) and renders styled inline
  errors instead.
- **Spam / abuse guards:** a hidden honeypot field, a minimum
  time-to-complete check, and a per-browser submission cooldown stored in
  `localStorage`.
- Submission state (`idle` / `submitting` / `succeeded` / `failed`) drives the
  status message and button.

---

## Navigation and footer

- [TopNavBar](src/components/layout/TopNavBar.jsx) is sticky and hides on scroll
  down / reveals on scroll up. On mobile it renders an animated dropdown menu
  that closes on outside click, scroll, or resize to desktop.
- [Footer](src/components/layout/Footer.jsx) renders the Privacy Policy and
  Terms of Service as modal dialogs. Their content is the static HTML in
  [src/privacy/](src/privacy/), imported at build time with Vite's `?raw`
  suffix, plus social links.

---

## Styling model

Two layers work together:

1. **Tailwind utility classes** for layout/spacing/typography in the JSX, backed
   by the design tokens in [src/tailwind.css](src/tailwind.css).
2. **Plain CSS** in [src/styles/](src/styles/) for the things Tailwind isn't
   suited to: keyframes, the SVG/canvas effects, and complex component states.
   All of it is pulled together by [src/styles.css](src/styles.css), which is
   imported once in `main.jsx`.

When JS needs to influence styling on a hot path, it sets CSS custom properties
(see [setStylePropertyIfChanged](src/lib/dom.js)) rather than rewriting class
lists, and the CSS reacts to those variables.

---

## Deployment & security

The site builds to static assets and ships strict security headers
(Content-Security-Policy, HSTS, `X-Frame-Options`, `Permissions-Policy`, …). The
CSP `connect-src` and `form-action` explicitly allow the Formspree endpoint and
the Google Fonts origins. The same header set is declared in **three** places,
one per environment, so keep them in agreement when changing anything:

- [vite.config.js](vite.config.js) — local `npm run preview`
- [public/_headers](public/_headers) — static hosts that read a `_headers` file
- [vercel.json](vercel.json) — Vercel deployment
