import {
  DEFAULT_SECTION_GRID_BURST_RGB,
  MAX_ACTIVE_SECTION_GRID_BURSTS,
  SECTION_CURSOR_THEMES,
  SECTION_GRID_BURST_DURATION_MS,
  SECTION_GRID_BURST_SAME_POINT_DISTANCE,
  SECTION_GRID_SIZE,
  SITE_GRID_THROUGH_SELECTOR,
  SOLUTION_CARD_BURST_ACTIVE_CLASS,
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

function getSectionBurstRgb(section) {
  const color = SECTION_CURSOR_THEMES.find((theme) => theme.id === section.id)?.color || '#1f4f8f';
  return getRgbFromHex(color) || DEFAULT_SECTION_GRID_BURST_RGB;
}

function setGridBurstShapeProperties(element, burstPoint, rgb) {
  element.style.setProperty('--section-grid-burst-rgb', rgb.join(', '));
  element.style.setProperty('--section-grid-burst-peak-opacity', (0.52 * burstPoint.opacityScale).toFixed(3));
  element.style.setProperty('--section-grid-burst-mid-opacity', (0.34 * burstPoint.opacityScale).toFixed(3));
  element.style.setProperty('--section-grid-burst-late-opacity', (0.13 * burstPoint.opacityScale).toFixed(3));
  element.style.setProperty('--section-grid-burst-early-radius', `${burstPoint.earlyRadius.toFixed(2)}px`);
  element.style.setProperty('--section-grid-burst-mid-radius', `${burstPoint.midRadius.toFixed(2)}px`);
  element.style.setProperty('--section-grid-burst-late-radius', `${burstPoint.lateRadius.toFixed(2)}px`);
  element.style.setProperty('--section-grid-burst-max-radius', `${burstPoint.maxRadius.toFixed(2)}px`);
}

function getSolutionCardFromTarget(target) {
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

function updateGridThroughCardBurst(card, clientX, clientY, burstPoint) {
  const cardRect = card.getBoundingClientRect();
  const section = card.closest('section.section-grid-bg');
  const rgb = section ? getSectionBurstRgb(section) : DEFAULT_SECTION_GRID_BURST_RGB;

  card.style.setProperty('--site-grid-through-burst-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-burst-y', `${(clientY - cardRect.top).toFixed(2)}px`);
  setGridBurstShapeProperties(card, burstPoint, rgb);
}

function removeGridBurstElement(burstElement, timeoutMap, windowObject) {
  if (timeoutMap.has(burstElement)) {
    windowObject.clearTimeout(timeoutMap.get(burstElement));
    timeoutMap.delete(burstElement);
  }
  burstElement.remove();
}

function removeNearbyGridBursts(existingBursts, clientX, clientY, timeoutMap, windowObject) {
  for (let index = existingBursts.length - 1; index >= 0; index -= 1) {
    const burstElement = existingBursts[index];
    const burstX = parsePixelValue(burstElement.style.getPropertyValue('--section-grid-burst-x'), Number.NaN);
    const burstY = parsePixelValue(burstElement.style.getPropertyValue('--section-grid-burst-y'), Number.NaN);

    if (
      Number.isFinite(burstX)
      && Number.isFinite(burstY)
      && Math.hypot(clientX - burstX, clientY - burstY) <= SECTION_GRID_BURST_SAME_POINT_DISTANCE
    ) {
      existingBursts.splice(index, 1);
      removeGridBurstElement(burstElement, timeoutMap, windowObject);
    }
  }
}

export function getGridBurstPoint(mainElement, section, clientX, clientY, pressure = 0.5) {
  const sectionRect = section.getBoundingClientRect();
  const computedStyle = getComputedStyle(section);
  const gridSize = parsePixelValue(
    computedStyle.getPropertyValue('--section-grid-size'),
    SECTION_GRID_SIZE
  );
  const normalizedPressure = clamp(pressure || 0.5, 0.35, 1);
  const viewport = mainElement.ownerDocument.defaultView;
  const viewportWidth = viewport?.innerWidth || mainElement.clientWidth || 1;
  const viewportScale = clamp(viewportWidth / 1440, 0.82, 1.16);
  const sectionScale = clamp(sectionRect.width / 960, 0.78, 1.08);
  const maxRadius = clamp(gridSize * 5.05 * viewportScale * sectionScale, 270, 430);

  return {
    opacityScale: 0.88 + normalizedPressure * 0.16,
    earlyRadius: clamp(gridSize * 1.32 * sectionScale, 84, 116),
    midRadius: maxRadius * 0.58,
    lateRadius: maxRadius * 0.84,
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

export function getGridBurstTargetCards(targetSections, target) {
  const card = getSolutionCardFromTarget(target);
  const section = card?.closest('section.section-grid-bg');

  return card && targetSections.includes(section) ? [card] : [];
}

export function restartSolutionCardBurst(card, clientX, clientY, burstPoint, timeoutMap, windowObject) {
  const previousTimeoutId = timeoutMap.get(card);
  if (previousTimeoutId) {
    windowObject.clearTimeout(previousTimeoutId);
  }

  if (card.matches(SITE_GRID_THROUGH_SELECTOR)) {
    updateGridThroughCardBurst(card, clientX, clientY, burstPoint);
  }

  const wasActive = card.classList.contains(SOLUTION_CARD_BURST_ACTIVE_CLASS);
  card.classList.remove(SOLUTION_CARD_BURST_ACTIVE_CLASS);
  if (wasActive) card.getBoundingClientRect();
  card.classList.add(SOLUTION_CARD_BURST_ACTIVE_CLASS);

  const timeoutId = windowObject.setTimeout(() => {
    card.classList.remove(SOLUTION_CARD_BURST_ACTIVE_CLASS);
    timeoutMap.delete(card);
  }, SECTION_GRID_BURST_DURATION_MS);

  timeoutMap.set(card, timeoutId);
}

export function appendSectionGridBurst(ownerDocument, targetSection, clientX, clientY, burstPoint, timeoutMap, windowObject) {
  const targetRect = targetSection.getBoundingClientRect();
  const existingBursts = Array.from(targetSection.querySelectorAll(':scope > .section-grid-burst'));
  const burstX = clientX - targetRect.left;
  const burstY = clientY - targetRect.top;

  removeNearbyGridBursts(existingBursts, burstX, burstY, timeoutMap, windowObject);

  while (existingBursts.length >= MAX_ACTIVE_SECTION_GRID_BURSTS) {
    const oldestBurst = existingBursts.shift();
    removeGridBurstElement(oldestBurst, timeoutMap, windowObject);
  }

  const burstElement = ownerDocument.createElement('span');
  burstElement.setAttribute('aria-hidden', 'true');
  burstElement.className = 'section-grid-burst';
  burstElement.style.setProperty('--section-grid-burst-x', `${burstX.toFixed(2)}px`);
  burstElement.style.setProperty('--section-grid-burst-y', `${burstY.toFixed(2)}px`);
  setGridBurstShapeProperties(burstElement, burstPoint, getSectionBurstRgb(targetSection));

  targetSection.appendChild(burstElement);

  const timeoutId = windowObject.setTimeout(() => {
    burstElement.remove();
    timeoutMap.delete(burstElement);
  }, SECTION_GRID_BURST_DURATION_MS);

  timeoutMap.set(burstElement, timeoutId);
}
