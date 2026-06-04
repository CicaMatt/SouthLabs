/* DOM selector strings and toggled class names that the section-grid
 * interaction layer queries and flips at runtime. These mirror class names
 * defined in the CSS and applied by the components — keep both sides in sync.
 * Card-surface *styling* (the class applied to cards + style objects) lives in
 * components/sections/cardSurface.js. */

export const CARD_GRID_ANCHOR_SELECTOR = '.card-grid-anchor';
export const GRID_BURST_DISABLED_SELECTOR = '.section-grid-burst-disabled';
export const SOLUTION_CARD_SURFACE_SELECTOR = '.solution-card-surface';
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
