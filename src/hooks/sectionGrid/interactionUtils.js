import {
  DEFAULT_SECTION_GRID_BURST_RGB,
  HERO_GRAPHIC_CURSOR_SMALL_CLASS,
  HERO_GRAPHIC_SELECTOR,
  MAX_ACTIVE_SECTION_GRID_BURSTS,
  MOUSE_WHEEL_ZOOM_MIN_DELTA,
  SECTION_CURSOR_DOT_SIZE,
  SECTION_CURSOR_THEMES,
  SECTION_GRID_BURST_DURATION_MS,
  SECTION_GRID_BURST_SAME_POINT_DISTANCE,
  SECTION_GRID_HIGHLIGHT_DISTANCE,
  SECTION_GRID_HIGHLIGHT_OPACITY,
  SECTION_GRID_SIZE,
  SITE_GRID_THROUGH_SELECTOR,
  SOLUTION_CARD_BURST_ACTIVE_CLASS,
  SOLUTION_CARD_SURFACE_SELECTOR,
  TOUCH_SELECTABLE_CARD_SELECTOR
} from './constants';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getSectionHighlightOpacity = (theme) => theme.highlightOpacity ?? SECTION_GRID_HIGHLIGHT_OPACITY;

export function getTime(windowObject) {
  return windowObject?.performance?.now?.() ?? Date.now();
}

function getSvgPointForClientPoint(svgElement, clientX, clientY) {
  const screenMatrix = svgElement.getScreenCTM?.();
  if (!screenMatrix) return null;

  try {
    if (typeof svgElement.createSVGPoint === 'function') {
      const point = svgElement.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      return point.matrixTransform(screenMatrix.inverse());
    }

    const DOMPoint = svgElement.ownerDocument.defaultView?.DOMPoint;
    return DOMPoint
      ? new DOMPoint(clientX, clientY).matrixTransform(screenMatrix.inverse())
      : null;
  } catch {
    return null;
  }
}

function isPointInRect(point, left, top, right, bottom) {
  return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

function isPointInEllipse(point, centerX, centerY, radiusX, radiusY) {
  const normalizedX = (point.x - centerX) / radiusX;
  const normalizedY = (point.y - centerY) / radiusY;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function isPointInPolygon(point, polygon) {
  let isInside = false;

  for (let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex, currentIndex += 1
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];
    const crossesY = (current.y > point.y) !== (previous.y > point.y);
    if (!crossesY) continue;

    const intersectX = ((previous.x - current.x) * (point.y - current.y))
      / (previous.y - current.y)
      + current.x;
    if (point.x < intersectX) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function getPointToSegmentDistance(point, start, end) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  if (!segmentLengthSquared) return Math.hypot(point.x - start.x, point.y - start.y);

  const progress = clamp(
    ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared,
    0,
    1
  );
  const closestX = start.x + segmentX * progress;
  const closestY = start.y + segmentY * progress;

  return Math.hypot(point.x - closestX, point.y - closestY);
}

function isPointInHeroGraphic(svgElement, clientX, clientY) {
  const point = getSvgPointForClientPoint(svgElement, clientX, clientY);
  if (!point) return false;

  const factoryBody = [
    { x: 126, y: 500 },
    { x: 126, y: 391 },
    { x: 380, y: 264 },
    { x: 494, y: 337 },
    { x: 494, y: 500 }
  ];
  const pipeBody = [
    { x: 236, y: 336 },
    { x: 252, y: 210 },
    { x: 290, y: 210 },
    { x: 306, y: 301 }
  ];
  const pipeToCloudDistance = getPointToSegmentDistance(point, { x: 271, y: 166 }, { x: 271, y: 210 });

  return (
    isPointInPolygon(point, factoryBody)
    || isPointInRect(point, 76, 500, 544, 520)
    || isPointInPolygon(point, pipeBody)
    || pipeToCloudDistance <= 12
    || isPointInEllipse(point, 300, 102, 148, 88)
    || isPointInRect(point, 190, 92, 410, 170)
  );
}

export function updateHeroGraphicCursorState(mainElement, clientX, clientY) {
  const heroGraphic = mainElement.querySelector(HERO_GRAPHIC_SELECTOR);
  const shouldUseSmallCursor = heroGraphic
    ? isPointInHeroGraphic(heroGraphic, clientX, clientY)
    : false;

  mainElement.classList.toggle(HERO_GRAPHIC_CURSOR_SMALL_CLASS, shouldUseSmallCursor);
}

function parsePixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCssTranslate(translateValue) {
  if (!translateValue || translateValue === 'none') {
    return { x: 0, y: 0 };
  }

  const [x = '0', y = '0'] = translateValue.trim().split(/\s+/);

  return {
    x: parsePixelValue(x),
    y: parsePixelValue(y)
  };
}

function getElementTranslate(element) {
  const windowObject = element.ownerDocument.defaultView;
  const computedStyle = windowObject?.getComputedStyle(element);
  const transform = computedStyle?.transform;
  const cssTranslate = parseCssTranslate(computedStyle?.translate);

  if (!transform || transform === 'none') {
    return cssTranslate;
  }

  const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
  if (matrix3d) {
    const values = matrix3d[1].split(',').map((value) => Number.parseFloat(value.trim()));

    return {
      x: (Number.isFinite(values[12]) ? values[12] : 0) + cssTranslate.x,
      y: (Number.isFinite(values[13]) ? values[13] : 0) + cssTranslate.y
    };
  }

  const matrix2d = transform.match(/^matrix\((.+)\)$/);
  if (matrix2d) {
    const values = matrix2d[1].split(',').map((value) => Number.parseFloat(value.trim()));

    return {
      x: (Number.isFinite(values[4]) ? values[4] : 0) + cssTranslate.x,
      y: (Number.isFinite(values[5]) ? values[5] : 0) + cssTranslate.y
    };
  }

  return cssTranslate;
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

function getSectionThemeColor(section) {
  return SECTION_CURSOR_THEMES.find((theme) => theme.id === section.id)?.color || '#1f4f8f';
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

function getPointToRectDistance(clientX, clientY, rect) {
  const dx = clientX < rect.left
    ? rect.left - clientX
    : Math.max(clientX - rect.right, 0);
  const dy = clientY < rect.top
    ? rect.top - clientY
    : Math.max(clientY - rect.bottom, 0);

  return Math.hypot(dx, dy);
}

export function getGridBurstTargetSections(mainElement, clientX, clientY, burstOuterRadius) {
  return Array.from(mainElement.querySelectorAll(':scope > section.section-grid-bg:not(#hero)'))
    .filter((section) => (
      getPointToRectDistance(clientX, clientY, section.getBoundingClientRect()) <= burstOuterRadius
    ));
}

export function getGridBurstTargetCards(targetSections, target) {
  const card = getSolutionCardFromTarget(target);
  const section = card?.closest('section.section-grid-bg');

  return card && targetSections.includes(section) ? [card] : [];
}

function getSolutionCardFromTarget(target) {
  return target instanceof Element ? target.closest(SOLUTION_CARD_SURFACE_SELECTOR) : null;
}

export function getTouchSelectableCardFromTarget(target) {
  return target instanceof Element ? target.closest(TOUCH_SELECTABLE_CARD_SELECTOR) : null;
}

export function clearGridThroughCardHighlight(card) {
  card.style.setProperty('--site-grid-through-highlight-opacity', '0');
}

export function updateGridThroughCardHighlight(card, clientX, clientY, color, opacity) {
  const cardRect = card.getBoundingClientRect();

  card.style.setProperty('--site-grid-through-highlight-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-highlight-y', `${(clientY - cardRect.top).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-highlight-color', color);
  card.style.setProperty('--site-grid-through-highlight-opacity', opacity.toFixed(3));
}

function getSectionBurstRgb(section) {
  return getRgbFromHex(getSectionThemeColor(section)) || DEFAULT_SECTION_GRID_BURST_RGB;
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
    const timeoutId = timeoutMap.get(burstElement);
    windowObject.clearTimeout(timeoutId);
    timeoutMap.delete(burstElement);
  }

  burstElement.remove();
}

function removeNearbyGridBursts(existingBursts, clientX, clientY, timeoutMap, windowObject) {
  for (let index = existingBursts.length - 1; index >= 0; index -= 1) {
    const burstElement = existingBursts[index];
    const burstX = parsePixelValue(
      burstElement.style.getPropertyValue('--section-grid-burst-x'),
      Number.NaN
    );
    const burstY = parsePixelValue(
      burstElement.style.getPropertyValue('--section-grid-burst-y'),
      Number.NaN
    );

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

export function restartSolutionCardBurst(card, clientX, clientY, burstPoint, timeoutMap, windowObject) {
  const previousTimeoutId = timeoutMap.get(card);
  if (previousTimeoutId) {
    windowObject.clearTimeout(previousTimeoutId);
  }

  if (card.matches(SITE_GRID_THROUGH_SELECTOR)) {
    updateGridThroughCardBurst(card, clientX, clientY, burstPoint);
  }

  card.classList.remove(SOLUTION_CARD_BURST_ACTIVE_CLASS);
  card.getBoundingClientRect();
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

  removeNearbyGridBursts(
    existingBursts,
    burstX,
    burstY,
    timeoutMap,
    windowObject
  );

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

export function syncSectionGridOrigins(mainElement) {
  const windowObject = mainElement.ownerDocument.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const sections = Array.from(mainElement.querySelectorAll(':scope > section'));
  let currentAdjustmentBefore = 0;
  let desiredAdjustmentBefore = 0;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const currentAdjustment = Number.parseFloat(
      section.style.getPropertyValue('--section-grid-snap-padding')
    ) || 0;
    const baseTop = rect.top + scrollY - currentAdjustmentBefore + desiredAdjustmentBefore;
    const baseHeight = rect.height - currentAdjustment;
    const unsnappedBottom = baseTop + baseHeight;
    const bottomRemainder = ((unsnappedBottom % SECTION_GRID_SIZE) + SECTION_GRID_SIZE) % SECTION_GRID_SIZE;
    const desiredAdjustment = bottomRemainder < 0.5
      ? 0
      : SECTION_GRID_SIZE - bottomRemainder;

    section.style.setProperty('--section-grid-origin-x', `${(rect.left + scrollX).toFixed(2)}px`);
    section.style.setProperty('--section-grid-origin-y', `${baseTop.toFixed(2)}px`);
    section.style.setProperty('--section-grid-snap-padding', `${desiredAdjustment.toFixed(2)}px`);

    section.querySelectorAll(SITE_GRID_THROUGH_SELECTOR).forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      const elementTranslate = getElementTranslate(element);
      const originX = elementRect.left + scrollX - elementTranslate.x;
      const originY = baseTop + elementRect.top - rect.top - elementTranslate.y;

      element.style.setProperty('--site-grid-through-origin-x', `${originX.toFixed(2)}px`);
      element.style.setProperty('--site-grid-through-origin-y', `${originY.toFixed(2)}px`);
    });

    currentAdjustmentBefore += currentAdjustment;
    desiredAdjustmentBefore += desiredAdjustment;
  });
}

function isImageTarget(target) {
  return target instanceof HTMLElement && target.closest('img');
}

export function preventImageDefault(event) {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
}

export function isDesktopChromium(windowObject) {
  const navigatorObject = windowObject.navigator;
  const userAgent = navigatorObject.userAgent || '';
  const brands = navigatorObject.userAgentData?.brands?.map(({ brand }) => brand).join(' ') || '';
  const hasFinePointer = windowObject.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = (
    navigatorObject.userAgentData?.mobile
    || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
  );
  const isChromium = (
    /\b(Chromium|Google Chrome|Chrome)\b/i.test(brands)
    || /\b(Chrome|Chromium)\//i.test(userAgent)
  );
  const isExcludedChromiumShell = /\b(Edg|OPR|Opera|SamsungBrowser|CriOS)\//i.test(userAgent);

  return hasFinePointer && !isMobile && isChromium && !isExcludedChromiumShell;
}

export function isLikelyDesktopTrackpadPinch(event, windowObject) {
  if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;

  const wheelEvent = windowObject.WheelEvent;
  if (wheelEvent && event.deltaMode !== wheelEvent.DOM_DELTA_PIXEL) return false;

  const delta = Math.max(
    Math.abs(event.deltaX || 0),
    Math.abs(event.deltaY || 0),
    Math.abs(event.deltaZ || 0)
  );
  if (!delta) return false;

  const wheelDeltaY = Math.abs(event.wheelDeltaY || 0);
  const looksLikeSteppedMouseWheel = (
    wheelDeltaY >= 120
    && wheelDeltaY % 120 === 0
    && delta >= MOUSE_WHEEL_ZOOM_MIN_DELTA
  );

  return !looksLikeSteppedMouseWheel;
}

export function getSectionCursorTheme(document, clientY) {
  const sectionEntries = SECTION_CURSOR_THEMES
    .map((theme) => {
      const element = document.getElementById(theme.id);
      return element ? { ...theme, element, rect: element.getBoundingClientRect() } : null;
    })
    .filter(Boolean);

  const currentIndex = sectionEntries.findIndex(({ rect }) => (
    clientY >= rect.top && clientY <= rect.bottom
  ));

  if (currentIndex === -1) return null;

  const current = sectionEntries[currentIndex];
  const highlights = [
    {
      section: current.element,
      color: current.color,
      opacity: getSectionHighlightOpacity(current)
    }
  ];
  const dotTop = clientY - SECTION_CURSOR_DOT_SIZE / 2;
  const dotBottom = clientY + SECTION_CURSOR_DOT_SIZE / 2;
  const topBorder = current.rect.top;
  const bottomBorder = current.rect.bottom;
  const distanceFromTop = clientY - topBorder;
  const distanceFromBottom = bottomBorder - clientY;

  if (currentIndex > 0 && distanceFromTop <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    const boundaryStrength = 1 - clamp(distanceFromTop / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push({
      section: sectionEntries[currentIndex - 1].element,
      color: sectionEntries[currentIndex - 1].color,
      opacity: getSectionHighlightOpacity(sectionEntries[currentIndex - 1]) * boundaryStrength
    });
  }

  if (currentIndex < sectionEntries.length - 1 && distanceFromBottom <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    const boundaryStrength = 1 - clamp(distanceFromBottom / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push({
      section: sectionEntries[currentIndex + 1].element,
      color: sectionEntries[currentIndex + 1].color,
      opacity: getSectionHighlightOpacity(sectionEntries[currentIndex + 1]) * boundaryStrength
    });
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
