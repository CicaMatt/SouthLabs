/* Pure helpers used to figure out, at click time, which sections and cards
 * should receive a grid burst and what shape/color the burst should have.
 * The actual rendering is delegated to the canvas controller in
 * `gridBurstCanvas.js` — that's where the animation lives. This file no
 * longer manipulates the DOM at all. */
import {
  DEFAULT_SECTION_GRID_BURST_RGB,
  SECTION_CURSOR_THEMES,
  SECTION_GRID_SIZE,
  CARD_GRID_ANCHOR_SELECTOR,
  SOLUTION_CARD_SURFACE_SELECTOR
} from './constants';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function parsePixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getRgbFromHex(hexColor) {
  const normalized = hexColor?.trim().replace('#', '');
  if (!normalized) return null;

  const expanded = normalized.length === 3
    ? normalized.split('').map((character) => `${character}${character}`).join('')
    : normalized;

  if (!/^[\da-f]{6}$/i.test(expanded)) return null;

  const value = Number.parseInt(expanded, 16);
  if (!Number.isFinite(value)) return null;

  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255
  ];
}

export function getSectionBurstRgb(section) {
  const color = SECTION_CURSOR_THEMES.find((theme) => theme.id === section.id)?.color || '#1f4f8f';
  return getRgbFromHex(color) || DEFAULT_SECTION_GRID_BURST_RGB;
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

export function getCardGridOriginPage(card, fallback) {
  if (!card) return fallback;
  const style = getComputedStyle(card);
  return {
    x: parsePixelValue(style.getPropertyValue('--card-grid-origin-x'), fallback?.x ?? 0),
    y: parsePixelValue(style.getPropertyValue('--card-grid-origin-y'), fallback?.y ?? 0)
  };
}

export function getSolutionCardFromTarget(target) {
  return target instanceof Element ? target.closest(SOLUTION_CARD_SURFACE_SELECTOR) : null;
}

function getPointToRectDistance(clientX, clientY, rect) {
  const dx = clientX < rect.left
    ? rect.left - clientX
    : Math.max(clientX - rect.right, 0);
  const dy = clientY < rect.top
    ? rect.top - clientY
    : Math.max(clientY - rect.bottom, 0);

  return Math.hypot(dx, dy);
}

export function getGridBurstPoint(mainElement, section, clientX, clientY, pressure = 0.5) {
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
    if (getPointToRectDistance(clientX, clientY, section.getBoundingClientRect()) <= burstOuterRadius) {
      targetSections.push(section);
    }
  });

  return targetSections;
}

export function getGridBurstTargetCards(targetSections, target, clientX, clientY, burstOuterRadius) {
  const cards = new Set();

  const clickedCard = getSolutionCardFromTarget(target);
  if (clickedCard
    && clickedCard.matches(CARD_GRID_ANCHOR_SELECTOR)
    && targetSections.includes(clickedCard.closest('section.section-grid-bg'))
  ) {
    cards.add(clickedCard);
  }

  targetSections.forEach((section) => {
    section.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR).forEach((card) => {
      if (getPointToRectDistance(clientX, clientY, card.getBoundingClientRect()) <= burstOuterRadius) {
        cards.add(card);
      }
    });
  });

  return Array.from(cards);
}

/* Read the card's border-radius (in CSS pixels) for canvas roundRect
   clipping. We snapshot it at click time — cheap and avoids ever needing to
   keep it in sync. */
export function getCardClipRadius(card) {
  if (!card) return 0;
  const style = getComputedStyle(card);
  return parsePixelValue(style.borderTopLeftRadius, 0);
}
