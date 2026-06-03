export const CARD_GRID_ANCHOR_SELECTOR = '.card-grid-anchor';
export const GRID_BURST_DISABLED_SELECTOR = '.section-grid-burst-disabled';
export const SOLUTION_CARD_SURFACE_SELECTOR = '.solution-card-surface';
export const SOLUTION_CARD_SURFACE_CLASS = [
  'solution-card-surface overflow-hidden rounded-xl',
  'border-2 backdrop-blur-[0.5px]',
  'motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms]',
  'motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
].join(' ');
export const LIGHT_CARD_SURFACE_RGB = '251, 252, 254';
export const LIGHT_CARD_SURFACE_HOVER_RGB = '226, 233, 243';
export const TOUCH_SELECTABLE_CARD_SELECTOR = `${SOLUTION_CARD_SURFACE_SELECTOR}, .infrastructure-image-card`;
export const SOLUTION_CARD_TOUCH_SELECTED_CLASS = 'solution-card-surface--touch-selected';
export const TOUCH_SCROLL_GUARD_CLASS = 'site-main--touch-scroll-guard';
export const TOUCH_SCROLLING_CLASS = 'site-main--touch-scrolling';
export const HERO_GRAPHIC_CURSOR_SMALL_CLASS = 'site-main--hero-graphic-cursor-small';
export const HERO_GRAPHIC_SELECTOR = '.hero-graphic-hover-target';

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
