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
      rect: element.getBoundingClientRect()
    });
  });

  return entries;
}

function makeHighlight(entry, opacity = getSectionHighlightOpacity(entry)) {
  return { section: entry.element, color: entry.color, opacity };
}

export function getSectionCursorTheme(document, clientY) {
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
    return {
      highlights,
      topColor: sectionEntries[currentIndex - 1].color,
      bottomColor: current.color,
      split: `${clamp(((topBorder - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
    };
  }

  if (currentIndex < sectionEntries.length - 1 && bottomBorder >= dotTop && bottomBorder <= dotBottom) {
    return {
      highlights,
      topColor: current.color,
      bottomColor: sectionEntries[currentIndex + 1].color,
      split: `${clamp(((bottomBorder - dotTop) / SECTION_CURSOR_DOT_SIZE) * 100, 0, 100).toFixed(2)}%`
    };
  }

  return {
    highlights,
    topColor: current.color,
    bottomColor: current.color,
    split: '100%'
  };
}
