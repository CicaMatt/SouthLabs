/* Pure helpers used to figure out, at click time, which sections should
 * receive a grid burst and what shape/color the burst should have.
 * The actual rendering is delegated to the canvas controller in
 * `gridBurstCanvas.js` — that's where the animation lives. This file no
 * longer manipulates the DOM at all. */
import { DEFAULT_SECTION_GRID_BURST_RGB, SECTION_CURSOR_THEMES } from './sectionRegistry';
import { hexToRgb } from '../../lib/color';
import { clamp } from '../../lib/math';
import { distancePointToRect } from '../../lib/geometry';
import { DEFAULT_SECTION_GRID_SIZE as SECTION_GRID_SIZE } from './useSectionGridInteractions';

function parsePixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getSectionBurstRgb(section) {
  const color = SECTION_CURSOR_THEMES.find((theme) => theme.id === section.id)?.color || '#1f4f8f';
  return hexToRgb(color) || DEFAULT_SECTION_GRID_BURST_RGB;
}

export function getCardGridEffectRgb(card) {
  if (!card) return null;

  const color = getComputedStyle(card).getPropertyValue('--card-grid-effect-color').trim();
  return hexToRgb(color);
}

export function getSectionBurstOpacityScale(section) {
  if (!section) return 1;
  const raw = getComputedStyle(section).getPropertyValue('--section-grid-burst-opacity-scale');
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getSectionGridSize(section) {
  if (!section) return SECTION_GRID_SIZE;
  const raw = getComputedStyle(section).getPropertyValue('--section-grid-size');
  return parsePixelValue(raw, SECTION_GRID_SIZE);
}

/* Page-space origin used to align the burst's grid lines with the
   section's background pattern. The section already exposes these as CSS
   custom properties set by `syncSectionGridOrigins`. */
export function getSectionGridOriginPage(section) {
  if (!section) return { x: 0, y: 0 };
  const style = getComputedStyle(section);
  return {
    x: parsePixelValue(style.getPropertyValue('--section-grid-origin-x'), 0),
    y: parsePixelValue(style.getPropertyValue('--section-grid-origin-y'), 0)
  };
}

export function getCardGridOriginPage(card, fallbackOrigin = { x: 0, y: 0 }) {
  if (!card) return fallbackOrigin;

  const windowObject = card.ownerDocument?.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const rect = card.getBoundingClientRect();
  const style = getComputedStyle(card);
  const cardOriginX = parsePixelValue(
    style.getPropertyValue('--card-grid-origin-x'),
    fallbackOrigin.x
  );
  const cardOriginY = parsePixelValue(
    style.getPropertyValue('--card-grid-origin-y'),
    fallbackOrigin.y
  );

  return {
    x: rect.left + scrollX - cardOriginX,
    y: rect.top + scrollY - cardOriginY
  };
}

export function getGridBurstPoint(mainElement, section, pressure = 0.5) {
  const sectionRect = section.getBoundingClientRect();
  const gridSize = getSectionGridSize(section);
  const normalizedPressure = clamp(pressure || 0.5, 0.35, 1);
  const viewport = mainElement.ownerDocument.defaultView;
  const viewportWidth = viewport?.innerWidth || mainElement.clientWidth || 1;
  const viewportScale = clamp(viewportWidth / 1440, 0.82, 1.16);
  const sectionScale = clamp(sectionRect.width / 960, 0.78, 1.08);
  const maxRadius = clamp(gridSize * 5.05 * viewportScale * sectionScale, 270, 430);

  return {
    opacityScale: 0.88 + normalizedPressure * 0.16,
    maxRadius
  };
}

export function getGridBurstTargetSections(mainElement, clientX, clientY, burstOuterRadius) {
  const targetSections = [];

  mainElement.querySelectorAll(':scope > section.section-grid-bg:not(#hero)').forEach((section) => {
    if (
      distancePointToRect(clientX, clientY, section.getBoundingClientRect()) <= burstOuterRadius
    ) {
      targetSections.push(section);
    }
  });

  return targetSections;
}
