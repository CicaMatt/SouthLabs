import { SOLUTION_CARD_SURFACE_SELECTOR } from './selectors';

export const SOFTWARE_SECTION_THEME_COLOR = '#95e3ff';
export const SOFTWARE_SECTION_THEME_RGB = getRgbFromHex(SOFTWARE_SECTION_THEME_COLOR);
export const SOFTWARE_SECTION_THEME_RGB_CSS = SOFTWARE_SECTION_THEME_RGB.join(', ');
export const DEFAULT_SECTION_GRID_BURST_RGB = [31, 79, 143];

export function getRgbFromHex(hexColor) {
  const normalized = hexColor?.trim().replace('#', '');
  if (!normalized) return null;

  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : normalized;

  if (!/^[\da-f]{6}$/i.test(expanded)) return null;

  const value = Number.parseInt(expanded, 16);
  if (!Number.isFinite(value)) return null;

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export const SECTION_CURSOR_THEMES = [
  {
    id: 'hero',
    color: '#95e3ff'
  },
  {
    id: 'siti-web',
    color: '#203658',
    zones: {
      selector: SOLUTION_CARD_SURFACE_SELECTOR,
      color: '#95e3ff'
    }
  },
  {
    id: 'software-automazione',
    color: SOFTWARE_SECTION_THEME_COLOR
  },
  {
    id: 'infrastrutture-hardware',
    color: '#203658',
    zones: {
      selector: SOLUTION_CARD_SURFACE_SELECTOR,
      color: '#95e3ff'
    }
  },
  {
    id: 'manutenzione-supporto',
    color: '#95e3ff'
  },
  {
    id: 'contatti',
    color: '#203658'
  }
];
