export const SECTION_GRID_SIZE = 72;
export const SECTION_CURSOR_DOT_SIZE = 20;
export const SECTION_GRID_HIGHLIGHT_DISTANCE = 118;
export const SECTION_GRID_HIGHLIGHT_OPACITY = 0.28;
export const CARD_GRID_ANCHOR_SELECTOR = '.card-grid-anchor';
export const SECTION_GRID_BURST_DURATION_MS = 1260;
export const SECTION_GRID_BURST_MIN_INTERVAL_MS = 90;
export const MAX_ACTIVE_SECTION_GRID_BURSTS = 3;
export const SECTION_GRID_BURST_EDGE_FEATHER = 120;
export const SECTION_GRID_BURST_SAME_POINT_DISTANCE = 54;
export const DEFAULT_SECTION_GRID_BURST_RGB = [31, 79, 143];
export const SOLUTION_CARD_SURFACE_SELECTOR = '.solution-card-surface';
export const TOUCH_SELECTABLE_CARD_SELECTOR = `${SOLUTION_CARD_SURFACE_SELECTOR}, .infrastructure-image-card`;
export const SOLUTION_CARD_BURST_ACTIVE_CLASS = 'solution-card-surface--burst-active';
export const SOLUTION_CARD_TOUCH_SELECTED_CLASS = 'solution-card-surface--touch-selected';
export const TOUCH_TAP_MAX_DISTANCE = 10;
export const TOUCH_TAP_MAX_DURATION_MS = 650;
export const TOUCH_SCROLL_SETTLE_MS = 220;
export const TOUCH_SCROLL_GUARD_CLASS = 'site-main--touch-scroll-guard';
export const TOUCH_SCROLLING_CLASS = 'site-main--touch-scrolling';
export const HERO_GRAPHIC_CURSOR_SMALL_CLASS = 'site-main--hero-graphic-cursor-small';
export const HERO_GRAPHIC_SELECTOR = '.hero-graphic-hover-target';
export const MOUSE_WHEEL_ZOOM_MIN_DELTA = 80;
export const SOFTWARE_SECTION_THEME_COLOR = '#128fbc';
export const SOFTWARE_SECTION_THEME_RGB = getRgbFromHex(SOFTWARE_SECTION_THEME_COLOR);
export const SOFTWARE_SECTION_THEME_RGB_CSS = SOFTWARE_SECTION_THEME_RGB.join(', ');

function getRgbFromHex(hex) {
  const value = Number.parseInt(hex.replace('#', ''), 16);

  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255
  ];
}

export const SECTION_CURSOR_THEMES = [
  {
    id: 'hero',
    color: '#b6ebff',
    highlightOpacity: 0
  },
  {
    id: 'siti-web',
    color: '#0a46c4'
  },
  {
    id: 'software-automazione',
    color: SOFTWARE_SECTION_THEME_COLOR,
    highlightOpacity: 0.18
  },
  {
    id: 'infrastrutture-hardware',
    color: '#28324b'
  },
  {
    id: 'manutenzione-supporto',
    color: '#b6ebff'
  },
  {
    id: 'contatti',
    color: '#28324b'
  }
];
