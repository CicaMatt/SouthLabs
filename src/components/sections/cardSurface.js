/* Solution-card surface styling shared across the section components.
 *
 * Exposes the Tailwind class string applied to card elements and the CSS
 * custom-property style objects that drive the card's background/hover tint.
 * The matching rules live in styles/cards/solution-card.css; the section
 * cursor/burst logic reads these surfaces by selector via
 * features/sectionGrid/domSelectors.js (SOLUTION_CARD_SURFACE_SELECTOR). */

export const SOLUTION_CARD_SURFACE_CLASS = [
  'solution-card-surface overflow-hidden rounded-xl',
  'border-2',
  'motion-reduce:transition-none'
].join(' ');

const LIGHT_CARD_SURFACE_RGB = '251, 252, 254';
const LIGHT_CARD_SURFACE_HOVER_RGB = '226, 233, 243';

export function getSolutionCardSurfaceStyle(
  restOpacity,
  hoverOpacity = restOpacity,
  rgb = LIGHT_CARD_SURFACE_RGB,
  hoverRgb = rgb
) {
  return {
    '--solution-card-bg-rgb': rgb,
    '--solution-card-bg-hover-rgb': hoverRgb,
    '--solution-card-bg-opacity': `${restOpacity}`,
    '--solution-card-bg-hover-opacity': `${hoverOpacity}`
  };
}

export function getLightSolutionCardSurfaceStyle(restOpacity, hoverOpacity = restOpacity) {
  return getSolutionCardSurfaceStyle(
    restOpacity,
    hoverOpacity,
    LIGHT_CARD_SURFACE_RGB,
    LIGHT_CARD_SURFACE_HOVER_RGB
  );
}
