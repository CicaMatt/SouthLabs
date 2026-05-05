# SouthLabs React Site

Single-page React/Vite website for SouthLabs. The app is structured as a sequence of content sections, styled mainly with Tailwind utility classes plus focused CSS modules for the custom animated hero.

## Run The Project

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starts the Vite development server. `npm run build` creates the production bundle in `dist/`.

## App Structure

```text
src/
  main.jsx                         React/Vite entrypoint and global CSS import
  App.jsx                          Page composition and section order
  styles.css                       Global stylesheet entrypoint and web-solution glow utilities
  styles/
    base.css                       Global typography and Material Symbols defaults
    hero.css                       Hero CSS import manifest
    hero/
      layout.css                   Hero shell, atmosphere, stage, and CTA sizing
      factory.css                  SVG factory presentation classes
      plume-chart.css              SVG plume/chart presentation classes
      keyframes.css                Hero/factory/plume animation keyframes
      responsive.css               Hero breakpoints and reduced-motion overrides
  components/
    SectionHeader.jsx              Shared title/subtitle block for sections
    layout/
      TopNavBar.jsx                Sticky nav, desktop links, mobile menu
      Footer.jsx                   Legal/contact/social footer columns
    hero/
      FactoryIllustration.jsx      Decorative animated SVG used in the hero
    sections/
      HeroSection.jsx              Main hero content, pointer state, SVG animation boost
      WebSolutionsSection.jsx      Responsive web-solution cards and reveal behavior
      SoftwareSection.jsx          AI feature card plus automation/service cards
      InfrastructureSection.jsx    Hardware service cards with image previews
      SupportSection.jsx           Support checklist and CTA panel
      ContactSection.jsx           Contact form layout and reusable form fields
```

## Component Notes

`App.jsx` is the safest place to change page order. Section anchor ids are used by `TopNavBar.jsx`, so keep nav links and section ids in sync.

`HeroSection.jsx` owns behavior only: pointer tracking, CSS variable updates, subheadline measurement, and temporary SVG animation speed-up. The SVG itself lives in `FactoryIllustration.jsx`, while its visual styling lives under `src/styles/hero/`.

`WebSolutionsSection.jsx` has the most layout logic after the hero. Its hooks keep background icons visually centered behind wrapped text and reveal cards on scroll while respecting reduced-motion preferences.

`ContactSection.jsx`, `Footer.jsx`, and `TopNavBar.jsx` use small local helper components to keep repeated markup and class names centralized.

## Styling Notes

Tailwind is loaded from the CDN in `index.html`; the project also imports `src/styles.css` from `main.jsx`.

Use Tailwind classes for normal layout and component styling. Use CSS files when behavior depends on custom selectors, pseudo-elements, CSS variables, media queries, or SVG animation classes.

The hero CSS is intentionally split because the animated SVG has many named layers. The class names beginning with `v-` belong to `FactoryIllustration.jsx`; rename them only when updating both the JSX and the matching CSS.

## Assets

Local assets live in `media/`:

- `media/logo/` contains the SouthLabs logo image and text mark.
- `media/icons/wordpress.png` is used as a CSS mask for the WordPress card icon.
- `media/images/` contains the web-solution preview images.

Infrastructure section images currently use external URLs directly in `InfrastructureSection.jsx`.
