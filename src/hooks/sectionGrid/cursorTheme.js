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

function applyZoneOverride(theme, current, clientX, clientY) {
  const zoneConfig = current.zones;
  if (!zoneConfig) return theme;

  const zoneElements = current.element.querySelectorAll(zoneConfig.selector);
  if (!zoneElements.length) return theme;

  const dotTop = clientY - SECTION_CURSOR_DOT_SIZE / 2;
  const dotBottom = clientY + SECTION_CURSOR_DOT_SIZE / 2;

  for (const zoneElement of zoneElements) {
    const rect = zoneElement.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right) continue;

    if (dotBottom < rect.top || dotTop > rect.bottom) continue;

    if (dotTop >= rect.top && dotBottom <= rect.bottom) {
      return {
        ...theme,
        topColor: zoneConfig.color,
        bottomColor: zoneConfig.color,
        split: '100%'
      };
    }

    if (rect.top >= dotTop && rect.top <= dotBottom) {
      return {
        ...theme,
        topColor: current.color,
        bottomColor: zoneConfig.color,
        split: `${clamp(((rect.top - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
      };
    }

    if (rect.bottom >= dotTop && rect.bottom <= dotBottom) {
      return {
        ...theme,
        topColor: zoneConfig.color,
        bottomColor: current.color,
        split: `${clamp(((rect.bottom - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
      };
    }
  }

  return theme;
}

export function getSectionCursorTheme(document, clientX, clientY) {
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
  const dotTop = clientY - SECTION_CURSOR_DOT_SIZE / 2;
  const dotBottom = clientY + SECTION_CURSOR_DOT_SIZE / 2;

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
    return applyZoneOverride({
      highlights,
      topColor: sectionEntries[currentIndex - 1].color,
      bottomColor: current.color,
      split: `${clamp(((topBorder - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
    }, current, clientX, clientY);
  }

  if (currentIndex < sectionEntries.length - 1 && bottomBorder >= dotTop && bottomBorder <= dotBottom) {
    return applyZoneOverride({
      highlights,
      topColor: current.color,
      bottomColor: sectionEntries[currentIndex + 1].color,
      split: `${clamp(((bottomBorder - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
    }, current, clientX, clientY);
  }

  return applyZoneOverride({
    highlights,
    topColor: current.color,
    bottomColor: current.color,
    split: '100%'
  }, current, clientX, clientY);
}
