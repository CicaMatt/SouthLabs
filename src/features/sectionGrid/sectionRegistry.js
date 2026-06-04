import { SOLUTION_CARD_SURFACE_SELECTOR } from './domSelectors';
import { hexToRgb } from '../../lib/color';

export const SOFTWARE_SECTION_THEME_COLOR = '#95e3ff';
export const SOFTWARE_SECTION_THEME_RGB = hexToRgb(SOFTWARE_SECTION_THEME_COLOR);
export const SOFTWARE_SECTION_THEME_RGB_CSS = SOFTWARE_SECTION_THEME_RGB.join(', ');
export const DEFAULT_SECTION_GRID_BURST_RGB = [31, 79, 143];

export const SECTION_CURSOR_THEMES = [
  {
    id: 'hero',
    color: '#95e3ff',
    highlightOpacity: 0
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
    color: SOFTWARE_SECTION_THEME_COLOR,
    highlightOpacity: 0.75
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
    color: '#95e3ff',
    highlightOpacity: 0.1875
  },
  {
    id: 'contatti',
    color: '#203658'
  }
];
