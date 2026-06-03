import { SECTION_CURSOR_THEMES } from './themes';
import { CARD_GRID_ANCHOR_SELECTOR } from './selectors';

export const SECTION_CURSOR_DOT_SIZE = 20;
const SECTION_GRID_HIGHLIGHT_DISTANCE = 110;
const SECTION_GRID_HIGHLIGHT_OPACITY = 0.25;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getSectionHighlightOpacity = (theme) =>
  theme.highlightOpacity ?? SECTION_GRID_HIGHLIGHT_OPACITY;

function readElementPageRect(element, scrollX, scrollY) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY,
    width: rect.width,
    height: rect.height
  };
}

function readCornerRadii(element) {
  const view = element.ownerDocument?.defaultView;
  if (!view) return { tl: 0, tr: 0, br: 0, bl: 0 };
  const style = view.getComputedStyle(element);
  return {
    tl: parseFloat(style.borderTopLeftRadius) || 0,
    tr: parseFloat(style.borderTopRightRadius) || 0,
    br: parseFloat(style.borderBottomRightRadius) || 0,
    bl: parseFloat(style.borderBottomLeftRadius) || 0
  };
}

function readCardGridAnchor(cardAnchor, scrollX, scrollY, fallbackColor) {
  const view = cardAnchor.ownerDocument?.defaultView;
  const customColor =
    view?.getComputedStyle(cardAnchor).getPropertyValue('--card-grid-effect-color').trim() || '';

  return {
    color: customColor || fallbackColor,
    element: cardAnchor,
    rect: readElementPageRect(cardAnchor, scrollX, scrollY)
  };
}

export function buildSectionCursorLayout(ownerDocument) {
  const windowObject = ownerDocument.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const entries = [];

  SECTION_CURSOR_THEMES.forEach((theme) => {
    const element = ownerDocument.getElementById(theme.id);
    if (!element) return;
    const zoneElements = theme.zones
      ? Array.from(element.querySelectorAll(theme.zones.selector)).map((zoneElement) => ({
          element: zoneElement,
          radii: readCornerRadii(zoneElement),
          rect: readElementPageRect(zoneElement, scrollX, scrollY)
        }))
      : [];

    const gridSize =
      Number.parseFloat(
        windowObject?.getComputedStyle(element).getPropertyValue('--section-grid-size')
      ) || 72;

    entries.push({
      cardAnchors: Array.from(element.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR)).map(
        (cardAnchor) => readCardGridAnchor(cardAnchor, scrollX, scrollY, theme.color)
      ),
      color: theme.color,
      element,
      gridSize,
      highlightOpacity: theme.highlightOpacity,
      rect: readElementPageRect(element, scrollX, scrollY),
      zones: theme.zones,
      zoneElements
    });
  });

  return { entries };
}

function makeHighlight(entry, opacity = getSectionHighlightOpacity(entry)) {
  return {
    cardAnchors: entry.cardAnchors,
    color: entry.color,
    gridSize: entry.gridSize,
    opacity,
    rect: entry.rect,
    section: entry.element
  };
}

const HIDDEN_ZONE_OVERLAY = {
  zoneColor: 'transparent',
  zoneInsetTop: 100,
  zoneInsetRight: 100,
  zoneInsetBottom: 100,
  zoneInsetLeft: 100,
  zoneRadiusTopLeft: 0,
  zoneRadiusTopRight: 0,
  zoneRadiusBottomRight: 0,
  zoneRadiusBottomLeft: 0
};

function applyZoneOverlay(theme, current, pageX, pageY, dotSize) {
  const zoneConfig = current.zones;
  if (!zoneConfig) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const zoneElements = current.zoneElements;
  if (!zoneElements.length) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const dotLeft = pageX - dotSize / 2;
  const dotRight = pageX + dotSize / 2;
  const dotTop = pageY - dotSize / 2;
  const dotBottom = pageY + dotSize / 2;

  for (const zoneElement of zoneElements) {
    const { radii, rect } = zoneElement;
    if (dotRight <= rect.left || dotLeft >= rect.right) continue;
    if (dotBottom <= rect.top || dotTop >= rect.bottom) continue;

    const insetTop = clamp(((rect.top - dotTop) / dotSize) * 100, 0, 100);
    const insetRight = clamp(((dotRight - rect.right) / dotSize) * 100, 0, 100);
    const insetBottom = clamp(((dotBottom - rect.bottom) / dotSize) * 100, 0, 100);
    const insetLeft = clamp(((rect.left - dotLeft) / dotSize) * 100, 0, 100);
    const { tl, tr, br, bl } = radii;

    return {
      ...theme,
      zoneColor: zoneConfig.color,
      zoneInsetTop: insetTop,
      zoneInsetRight: insetRight,
      zoneInsetBottom: insetBottom,
      zoneInsetLeft: insetLeft,
      zoneRadiusTopLeft: insetTop > 0 && insetLeft > 0 ? tl : 0,
      zoneRadiusTopRight: insetTop > 0 && insetRight > 0 ? tr : 0,
      zoneRadiusBottomRight: insetBottom > 0 && insetRight > 0 ? br : 0,
      zoneRadiusBottomLeft: insetBottom > 0 && insetLeft > 0 ? bl : 0
    };
  }

  return { ...theme, ...HIDDEN_ZONE_OVERLAY };
}

export function getSectionCursorTheme(layout, pageX, pageY, dotSize = SECTION_CURSOR_DOT_SIZE) {
  const sectionEntries = layout?.entries ?? [];
  const currentIndex = sectionEntries.findIndex(
    ({ rect }) => pageY >= rect.top && pageY <= rect.bottom
  );

  if (currentIndex === -1) return null;

  const current = sectionEntries[currentIndex];
  const highlights = [makeHighlight(current)];

  const topBorder = current.rect.top;
  const bottomBorder = current.rect.bottom;
  const distanceFromTop = pageY - topBorder;
  const distanceFromBottom = bottomBorder - pageY;
  const dotTop = pageY - dotSize / 2;
  const dotBottom = pageY + dotSize / 2;

  if (currentIndex > 0 && distanceFromTop <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    const neighbor = sectionEntries[currentIndex - 1];
    const boundaryStrength = 1 - clamp(distanceFromTop / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push(
      makeHighlight(neighbor, getSectionHighlightOpacity(neighbor) * boundaryStrength)
    );
  }

  if (
    currentIndex < sectionEntries.length - 1 &&
    distanceFromBottom <= SECTION_GRID_HIGHLIGHT_DISTANCE
  ) {
    const neighbor = sectionEntries[currentIndex + 1];
    const boundaryStrength = 1 - clamp(distanceFromBottom / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push(
      makeHighlight(neighbor, getSectionHighlightOpacity(neighbor) * boundaryStrength)
    );
  }

  if (currentIndex > 0 && topBorder >= dotTop && topBorder <= dotBottom) {
    return applyZoneOverlay(
      {
        highlights,
        topColor: sectionEntries[currentIndex - 1].color,
        bottomColor: current.color,
        split: `${clamp(((topBorder - dotTop) / dotSize) * 100, 0, 100).toFixed(2)}%`
      },
      current,
      pageX,
      pageY,
      dotSize
    );
  }

  if (
    currentIndex < sectionEntries.length - 1 &&
    bottomBorder >= dotTop &&
    bottomBorder <= dotBottom
  ) {
    return applyZoneOverlay(
      {
        highlights,
        topColor: current.color,
        bottomColor: sectionEntries[currentIndex + 1].color,
        split: `${clamp(((bottomBorder - dotTop) / dotSize) * 100, 0, 100).toFixed(2)}%`
      },
      current,
      pageX,
      pageY,
      dotSize
    );
  }

  return applyZoneOverlay(
    {
      highlights,
      topColor: current.color,
      bottomColor: current.color,
      split: '100%'
    },
    current,
    pageX,
    pageY,
    dotSize
  );
}
