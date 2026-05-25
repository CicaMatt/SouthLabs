import { SECTION_CURSOR_THEMES } from './themes';

const SECTION_CURSOR_DOT_SIZE = 20;
const SECTION_GRID_HIGHLIGHT_DISTANCE = 110;
const SECTION_GRID_HIGHLIGHT_OPACITY = 0.25;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getSectionHighlightOpacity = (theme) => theme.highlightOpacity ?? SECTION_GRID_HIGHLIGHT_OPACITY;

function buildSectionEntries(document) {
  const entries = [];

  SECTION_CURSOR_THEMES.forEach((theme) => {
    const element = document.getElementById(theme.id);
    if (!element) return;

    entries.push({
      color: theme.color,
      element,
      highlightOpacity: theme.highlightOpacity,
      zones: theme.zones,
      rect: element.getBoundingClientRect()
    });
  });

  return entries;
}

function makeHighlight(entry, opacity = getSectionHighlightOpacity(entry)) {
  return { section: entry.element, color: entry.color, opacity };
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

function applyZoneOverlay(theme, current, clientX, clientY, dotSize) {
  const zoneConfig = current.zones;
  if (!zoneConfig) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const zoneElements = current.element.querySelectorAll(zoneConfig.selector);
  if (!zoneElements.length) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const dotLeft = clientX - dotSize / 2;
  const dotRight = clientX + dotSize / 2;
  const dotTop = clientY - dotSize / 2;
  const dotBottom = clientY + dotSize / 2;

  for (const zoneElement of zoneElements) {
    const rect = zoneElement.getBoundingClientRect();
    if (dotRight <= rect.left || dotLeft >= rect.right) continue;
    if (dotBottom <= rect.top || dotTop >= rect.bottom) continue;

    const insetTop = clamp(((rect.top - dotTop) / dotSize) * 100, 0, 100);
    const insetRight = clamp(((dotRight - rect.right) / dotSize) * 100, 0, 100);
    const insetBottom = clamp(((dotBottom - rect.bottom) / dotSize) * 100, 0, 100);
    const insetLeft = clamp(((rect.left - dotLeft) / dotSize) * 100, 0, 100);
    const { tl, tr, br, bl } = readCornerRadii(zoneElement);

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

export function getSectionCursorTheme(document, clientX, clientY, dotSize = SECTION_CURSOR_DOT_SIZE) {
  const sectionEntries = buildSectionEntries(document);
  const currentIndex = sectionEntries.findIndex(({ rect }) => (
    clientY >= rect.top && clientY <= rect.bottom
  ));

  if (currentIndex === -1) return null;

  const current = sectionEntries[currentIndex];
  const highlights = [makeHighlight(current)];

  const topBorder = current.rect.top;
  const bottomBorder = current.rect.bottom;
  const distanceFromTop = clientY - topBorder;
  const distanceFromBottom = bottomBorder - clientY;
  const dotTop = clientY - dotSize / 2;
  const dotBottom = clientY + dotSize / 2;

  if (currentIndex > 0 && distanceFromTop <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    const neighbor = sectionEntries[currentIndex - 1];
    const boundaryStrength = 1 - clamp(distanceFromTop / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push(makeHighlight(neighbor, getSectionHighlightOpacity(neighbor) * boundaryStrength));
  }

  if (currentIndex < sectionEntries.length - 1 && distanceFromBottom <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    const neighbor = sectionEntries[currentIndex + 1];
    const boundaryStrength = 1 - clamp(distanceFromBottom / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push(makeHighlight(neighbor, getSectionHighlightOpacity(neighbor) * boundaryStrength));
  }

  if (currentIndex > 0 && topBorder >= dotTop && topBorder <= dotBottom) {
    return applyZoneOverlay({
      highlights,
      topColor: sectionEntries[currentIndex - 1].color,
      bottomColor: current.color,
      split: `${clamp(((topBorder - dotTop) / dotSize) * 100, 0, 100).toFixed(2)}%`
    }, current, clientX, clientY, dotSize);
  }

  if (currentIndex < sectionEntries.length - 1 && bottomBorder >= dotTop && bottomBorder <= dotBottom) {
    return applyZoneOverlay({
      highlights,
      topColor: current.color,
      bottomColor: sectionEntries[currentIndex + 1].color,
      split: `${clamp(((bottomBorder - dotTop) / dotSize) * 100, 0, 100).toFixed(2)}%`
    }, current, clientX, clientY, dotSize);
  }

  return applyZoneOverlay({
    highlights,
    topColor: current.color,
    bottomColor: current.color,
    split: '100%'
  }, current, clientX, clientY, dotSize);
}
