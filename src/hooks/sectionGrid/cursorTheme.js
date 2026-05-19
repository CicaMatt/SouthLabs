import {
  SECTION_CURSOR_DOT_SIZE,
  SECTION_CURSOR_THEMES,
  SECTION_GRID_HIGHLIGHT_DISTANCE,
  SECTION_GRID_HIGHLIGHT_OPACITY
} from './constants';

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
  zoneInsetLeft: 100
};

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

    return {
      ...theme,
      zoneColor: zoneConfig.color,
      zoneInsetTop: clamp(((rect.top - dotTop) / dotSize) * 100, 0, 100),
      zoneInsetRight: clamp(((dotRight - rect.right) / dotSize) * 100, 0, 100),
      zoneInsetBottom: clamp(((dotBottom - rect.bottom) / dotSize) * 100, 0, 100),
      zoneInsetLeft: clamp(((rect.left - dotLeft) / dotSize) * 100, 0, 100)
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
