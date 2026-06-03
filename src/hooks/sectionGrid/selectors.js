export const CARD_GRID_ANCHOR_SELECTOR = '.card-grid-anchor';
export const GRID_BURST_DISABLED_SELECTOR = '.section-grid-burst-disabled';
export const SOLUTION_CARD_SURFACE_SELECTOR = '.solution-card-surface';
export const SOLUTION_CARD_SURFACE_CLASS = [
  'solution-card-surface overflow-hidden rounded-xl',
  'border-2',
  'motion-reduce:transition-none'
].join(' ');
export const LIGHT_CARD_SURFACE_RGB = '251, 252, 254';
export const LIGHT_CARD_SURFACE_HOVER_RGB = '226, 233, 243';
export const TOUCH_SELECTABLE_CARD_SELECTOR = `${SOLUTION_CARD_SURFACE_SELECTOR}, .infrastructure-image-card`;
export const SOLUTION_CARD_TOUCH_SELECTED_CLASS = 'solution-card-surface--touch-selected';
export const TOUCH_SCROLL_GUARD_CLASS = 'site-main--touch-scroll-guard';
export const TOUCH_SCROLLING_CLASS = 'site-main--touch-scrolling';
export const HERO_GRAPHIC_CURSOR_SMALL_CLASS = 'site-main--hero-graphic-cursor-small';
export const HERO_GRAPHIC_SELECTOR = '.hero-graphic-hover-target';
export const SECTION_CURSOR_COMPACT_CLASS = 'site-main--section-cursor-compact';
export const SECTION_CURSOR_NATIVE_CLASS = 'site-main--section-cursor-native';
export const SECTION_CURSOR_COMPACT_TARGET_SELECTOR = [
  'a',
  'article',
  'button',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'p',
  'span',
  '.group',
  '.software-card-surface',
  CARD_GRID_ANCHOR_SELECTOR,
  "[role='button']",
  "[role='link']"
].join(',');
export const SECTION_CURSOR_NATIVE_TARGET_SELECTOR = [
  'input',
  'label',
  'select',
  'textarea',
  '.contact-form-panel',
  "[contenteditable='true']"
].join(',');

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
