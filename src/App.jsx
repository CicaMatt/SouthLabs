import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import TopNavBar from './components/layout/TopNavBar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import WebSolutionsSection from './components/sections/WebSolutionsSection';
import SoftwareSection from './components/sections/SoftwareSection';
import InfrastructureSection from './components/sections/InfrastructureSection';
import SupportSection from './components/sections/SupportSection';
import ContactSection from './components/sections/ContactSection';

const GRID_MOTION_X = 10;
const SECTION_GRID_SIZE = 72;
const SECTION_CURSOR_DOT_SIZE = 20;
const SECTION_GRID_HIGHLIGHT_DISTANCE = 118;
const SECTION_GRID_HIGHLIGHT_OPACITY = 0.28;
const SITE_GRID_THROUGH_SELECTOR = '.site-grid-through-card';
const SECTION_GRID_BURST_DURATION_MS = 1260;
const SECTION_GRID_BURST_MIN_INTERVAL_MS = 90;
const MAX_ACTIVE_SECTION_GRID_BURSTS = 3;
const SECTION_GRID_BURST_EDGE_FEATHER = 120;
const SECTION_GRID_BURST_SAME_POINT_DISTANCE = 54;
const SOLUTION_CARD_SURFACE_SELECTOR = '.solution-card-surface';
const SOLUTION_CARD_BURST_ACTIVE_CLASS = 'solution-card-surface--burst-active';
const SOLUTION_CARD_TOUCH_SELECTED_CLASS = 'solution-card-surface--touch-selected';
const TOUCH_TAP_MAX_DISTANCE = 10;
const TOUCH_TAP_MAX_DURATION_MS = 650;
const TOUCH_SCROLL_SETTLE_MS = 220;
const TOUCH_SCROLL_GUARD_CLASS = 'site-main--touch-scroll-guard';
const TOUCH_SCROLLING_CLASS = 'site-main--touch-scrolling';
const HERO_CTA_DEFAULT_BACKGROUND_COLOR = '#b6ebff';

const SECTION_CURSOR_THEMES = [
  {
    id: 'hero',
    color: HERO_CTA_DEFAULT_BACKGROUND_COLOR,
    highlightOpacity: 0
  },
  {
    id: 'siti-web',
    color: '#1557d4'
  },
  {
    id: 'software-automazione',
    color: '#1f4f8f'
  },
  {
    id: 'infrastrutture-hardware',
    color: '#2b3b59'
  },
  {
    id: 'manutenzione-supporto',
    color: '#b6ebff'
  },
  {
    id: 'contatti',
    color: '#222a3e'
  }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const getSectionHighlightOpacity = (theme) => theme.highlightOpacity ?? SECTION_GRID_HIGHLIGHT_OPACITY;

function getTime(windowObject) {
  return windowObject?.performance?.now?.() ?? Date.now();
}

function getGridOffsetXForClientX(mainElement, clientX) {
  const viewport = mainElement.ownerDocument.defaultView;
  const width = viewport?.innerWidth || mainElement.clientWidth || 1;
  const shiftX = (clamp(clientX / width, 0, 1) - 0.5) * 2;

  return shiftX * -GRID_MOTION_X;
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

function getGridBurstPoint(mainElement, section, clientX, clientY, pressure = 0.5) {
  const sectionRect = section.getBoundingClientRect();
  const computedStyle = getComputedStyle(section);
  const gridSize = parsePixelValue(
    computedStyle.getPropertyValue('--section-grid-size'),
    SECTION_GRID_SIZE
  );
  const localX = clientX - sectionRect.left;
  const localY = clientY - sectionRect.top;
  const normalizedPressure = clamp(pressure || 0.5, 0.35, 1);
  const viewport = mainElement.ownerDocument.defaultView;
  const viewportWidth = viewport?.innerWidth || mainElement.clientWidth || 1;
  const viewportScale = clamp(viewportWidth / 1440, 0.82, 1.16);
  const sectionScale = clamp(sectionRect.width / 960, 0.78, 1.08);
  const maxRadius = clamp(gridSize * 5.05 * viewportScale * sectionScale, 270, 430);

  return {
    x: localX,
    y: localY,
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

function getGridBurstTargetSections(mainElement, clientX, clientY, burstOuterRadius) {
  return Array.from(mainElement.querySelectorAll(':scope > section.section-grid-bg:not(#hero)'))
    .filter((section) => (
      getPointToRectDistance(clientX, clientY, section.getBoundingClientRect()) <= burstOuterRadius
    ));
}

function getGridBurstTargetCards(targetSections, target) {
  const card = getSolutionCardFromTarget(target);
  const section = card?.closest('section.section-grid-bg');

  return card && targetSections.includes(section) ? [card] : [];
}

function getSolutionCardFromTarget(target) {
  return target instanceof Element ? target.closest(SOLUTION_CARD_SURFACE_SELECTOR) : null;
}

function clearGridThroughCardHighlight(card) {
  card.style.setProperty('--site-grid-through-highlight-opacity', '0');
}

function updateGridThroughCardHighlight(card, clientX, clientY, color, opacity) {
  const cardRect = card.getBoundingClientRect();

  card.style.setProperty('--site-grid-through-highlight-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-highlight-y', `${(clientY - cardRect.top).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-highlight-color', color);
  card.style.setProperty('--site-grid-through-highlight-opacity', opacity.toFixed(3));
}

function updateGridThroughCardBurst(card, clientX, clientY, burstPoint) {
  const cardRect = card.getBoundingClientRect();
  const section = card.closest('section.section-grid-bg');
  const color = section ? getSectionThemeColor(section) : '#1f4f8f';
  const rgb = getRgbFromHex(color) || [31, 79, 143];

  card.style.setProperty('--site-grid-through-burst-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-burst-y', `${(clientY - cardRect.top).toFixed(2)}px`);
  card.style.setProperty('--section-grid-burst-rgb', rgb.join(', '));
  card.style.setProperty('--section-grid-burst-peak-opacity', (0.52 * burstPoint.opacityScale).toFixed(3));
  card.style.setProperty('--section-grid-burst-mid-opacity', (0.34 * burstPoint.opacityScale).toFixed(3));
  card.style.setProperty('--section-grid-burst-late-opacity', (0.13 * burstPoint.opacityScale).toFixed(3));
  card.style.setProperty('--section-grid-burst-early-radius', `${burstPoint.earlyRadius.toFixed(2)}px`);
  card.style.setProperty('--section-grid-burst-mid-radius', `${burstPoint.midRadius.toFixed(2)}px`);
  card.style.setProperty('--section-grid-burst-late-radius', `${burstPoint.lateRadius.toFixed(2)}px`);
  card.style.setProperty('--section-grid-burst-max-radius', `${burstPoint.maxRadius.toFixed(2)}px`);
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

function syncSectionGridOrigins(mainElement) {
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

function preventImageDefault(event) {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
}

function isHeroTarget(target) {
  return target instanceof Element && Boolean(target.closest('#hero'));
}

function getSectionCursorTheme(document, clientY) {
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

// Single-page composition: nav, ordered content sections, and footer.
export default function App() {
  const gridFrameRef = useRef(0);
  const gridBurstTimeoutsRef = useRef(new Map());
  const lastGridBurstAtRef = useRef(Number.NEGATIVE_INFINITY);
  const solutionCardBurstTimeoutsRef = useRef(new Map());
  const sectionCursorFrameRef = useRef(0);
  const lastSectionCursorPointRef = useRef(null);
  const lastTouchScrollAtRef = useRef(Number.NEGATIVE_INFINITY);
  const highlightedSectionsRef = useRef([]);
  const highlightedGridThroughCardsRef = useRef([]);
  const touchGridGestureRef = useRef(null);
  const touchScrollGuardTimeoutRef = useRef(0);
  const touchSelectedCardRef = useRef(null);
  const sectionCursorRef = useRef(null);
  const mainRef = useRef(null);
  const heroGridOffsetResetRef = useRef(false);

  const setGridOffset = useCallback((x, y) => {
    if (gridFrameRef.current) {
      cancelAnimationFrame(gridFrameRef.current);
    }

    gridFrameRef.current = requestAnimationFrame(() => {
      const mainElement = mainRef.current;
      if (!mainElement) return;

      mainElement.style.setProperty('--site-grid-offset-x', `${x.toFixed(2)}px`);
      mainElement.style.setProperty('--site-grid-offset-y', `${y.toFixed(2)}px`);
    });
  }, []);

  const resetGridOffset = useCallback(() => {
    setGridOffset(0, 0);
  }, [setGridOffset]);

  const clearTouchSelectedCard = useCallback(() => {
    touchSelectedCardRef.current?.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    touchSelectedCardRef.current = null;
  }, []);

  const selectTouchCard = useCallback((card) => {
    if (!card) {
      clearTouchSelectedCard();
      return;
    }

    if (touchSelectedCardRef.current && touchSelectedCardRef.current !== card) {
      touchSelectedCardRef.current.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    }

    card.classList.add(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    touchSelectedCardRef.current = card;
  }, [clearTouchSelectedCard]);

  const hideSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }

    sectionCursorFrameRef.current = requestAnimationFrame(() => {
      highlightedSectionsRef.current.forEach((section) => {
        section.style.setProperty('--section-grid-highlight-opacity', '0');
      });
      highlightedSectionsRef.current = [];
      highlightedGridThroughCardsRef.current.forEach(clearGridThroughCardHighlight);
      highlightedGridThroughCardsRef.current = [];
      sectionCursorRef.current?.style.setProperty('--section-cursor-opacity', '0');
    });
  }, []);

  const updateSectionCursorAtPoint = useCallback((ownerDocument, clientX, clientY) => {
    const cursorElement = sectionCursorRef.current;
    if (!cursorElement) return;

    const theme = getSectionCursorTheme(ownerDocument, clientY);
    if (!theme) {
      hideSectionCursor();
      return;
    }

    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }

    sectionCursorFrameRef.current = requestAnimationFrame(() => {
      const nextHighlightedSections = theme.highlights.map(({ section }) => section);
      highlightedSectionsRef.current.forEach((section) => {
        if (!nextHighlightedSections.includes(section)) {
          section.style.setProperty('--section-grid-highlight-opacity', '0');
        }
      });

      theme.highlights.forEach(({ section, color, opacity }) => {
        const sectionRect = section.getBoundingClientRect();
        section.style.setProperty('--section-grid-highlight-x', `${(clientX - sectionRect.left).toFixed(2)}px`);
        section.style.setProperty('--section-grid-highlight-y', `${(clientY - sectionRect.top).toFixed(2)}px`);
        section.style.setProperty('--section-grid-highlight-color', color);
        section.style.setProperty('--section-grid-highlight-opacity', opacity.toFixed(3));
      });
      highlightedSectionsRef.current = nextHighlightedSections;

      const nextHighlightedGridThroughCards = new Set();
      theme.highlights.forEach(({ section, color, opacity }) => {
        section.querySelectorAll(SITE_GRID_THROUGH_SELECTOR).forEach((card) => {
          updateGridThroughCardHighlight(card, clientX, clientY, color, opacity);
          nextHighlightedGridThroughCards.add(card);
        });
      });
      highlightedGridThroughCardsRef.current.forEach((card) => {
        if (!nextHighlightedGridThroughCards.has(card)) {
          clearGridThroughCardHighlight(card);
        }
      });
      highlightedGridThroughCardsRef.current = Array.from(nextHighlightedGridThroughCards);

      cursorElement.style.setProperty('--section-cursor-x', `${clientX}px`);
      cursorElement.style.setProperty('--section-cursor-y', `${clientY}px`);
      cursorElement.style.setProperty('--section-cursor-top-color', theme.topColor);
      cursorElement.style.setProperty('--section-cursor-bottom-color', theme.bottomColor);
      cursorElement.style.setProperty('--section-cursor-split', theme.split);
      cursorElement.style.setProperty('--section-cursor-opacity', '1');
    });
  }, [hideSectionCursor]);

  const scheduleTouchScrollGuardRelease = useCallback((mainElement, delay = TOUCH_SCROLL_SETTLE_MS) => {
    const windowObject = mainElement.ownerDocument.defaultView;
    if (!windowObject) return;

    if (touchScrollGuardTimeoutRef.current) {
      windowObject.clearTimeout(touchScrollGuardTimeoutRef.current);
    }

    touchScrollGuardTimeoutRef.current = windowObject.setTimeout(() => {
      touchScrollGuardTimeoutRef.current = 0;
      if (touchGridGestureRef.current) return;

      mainElement.classList.remove(TOUCH_SCROLL_GUARD_CLASS, TOUCH_SCROLLING_CLASS);
    }, delay);
  }, []);

  const markTouchScrolling = useCallback((mainElement) => {
    const windowObject = mainElement.ownerDocument.defaultView;
    if (!windowObject) return;

    lastTouchScrollAtRef.current = getTime(windowObject);
    clearTouchSelectedCard();
    mainElement.classList.add(TOUCH_SCROLL_GUARD_CLASS, TOUCH_SCROLLING_CLASS);
    scheduleTouchScrollGuardRelease(mainElement);
  }, [clearTouchSelectedCard, scheduleTouchScrollGuardRelease]);

  const handleMainPointerLeave = useCallback((event) => {
    if (event.pointerType === 'touch') {
      touchGridGestureRef.current = null;
      scheduleTouchScrollGuardRelease(event.currentTarget);
      return;
    }

    heroGridOffsetResetRef.current = false;
    lastSectionCursorPointRef.current = null;
    resetGridOffset();
    hideSectionCursor();
  }, [hideSectionCursor, resetGridOffset, scheduleTouchScrollGuardRelease]);

  const triggerSectionGridBurstAtPoint = useCallback(({
    clientX,
    clientY,
    mainElement,
    pressure = 0.5,
    target
  }) => {
    const section = target instanceof Element
      ? target.closest('section.section-grid-bg')
      : null;

    if (!section || section.id === 'hero' || !mainElement.contains(section)) return;

    const ownerDocument = mainElement.ownerDocument;
    const windowObject = ownerDocument.defaultView;
    if (!windowObject) return;

    const now = getTime(windowObject);
    if (now - lastGridBurstAtRef.current < SECTION_GRID_BURST_MIN_INTERVAL_MS) return;
    lastGridBurstAtRef.current = now;

    const burstPoint = getGridBurstPoint(
      mainElement,
      section,
      clientX,
      clientY,
      pressure
    );
    const burstOuterRadius = burstPoint.maxRadius + SECTION_GRID_BURST_EDGE_FEATHER;
    const targetSections = getGridBurstTargetSections(
      mainElement,
      clientX,
      clientY,
      burstOuterRadius
    );
    const targetCards = getGridBurstTargetCards(
      targetSections,
      target
    );

    targetCards.forEach((card) => {
      const previousTimeoutId = solutionCardBurstTimeoutsRef.current.get(card);
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
        solutionCardBurstTimeoutsRef.current.delete(card);
      }, SECTION_GRID_BURST_DURATION_MS);

      solutionCardBurstTimeoutsRef.current.set(card, timeoutId);
    });

    targetSections.forEach((targetSection) => {
      const targetRect = targetSection.getBoundingClientRect();
      const color = getSectionThemeColor(targetSection);
      const rgb = getRgbFromHex(color) || [31, 79, 143];
      const existingBursts = Array.from(targetSection.querySelectorAll(':scope > .section-grid-burst'));
      const burstX = clientX - targetRect.left;
      const burstY = clientY - targetRect.top;

      removeNearbyGridBursts(
        existingBursts,
        burstX,
        burstY,
        gridBurstTimeoutsRef.current,
        windowObject
      );

      while (existingBursts.length >= MAX_ACTIVE_SECTION_GRID_BURSTS) {
        const oldestBurst = existingBursts.shift();
        removeGridBurstElement(oldestBurst, gridBurstTimeoutsRef.current, windowObject);
      }

      const burstElement = ownerDocument.createElement('span');
      burstElement.setAttribute('aria-hidden', 'true');
      burstElement.className = 'section-grid-burst';
      burstElement.style.setProperty('--section-grid-burst-x', `${burstX.toFixed(2)}px`);
      burstElement.style.setProperty('--section-grid-burst-y', `${burstY.toFixed(2)}px`);
      burstElement.style.setProperty('--section-grid-burst-rgb', rgb.join(', '));
      burstElement.style.setProperty('--section-grid-burst-peak-opacity', (0.52 * burstPoint.opacityScale).toFixed(3));
      burstElement.style.setProperty('--section-grid-burst-mid-opacity', (0.34 * burstPoint.opacityScale).toFixed(3));
      burstElement.style.setProperty('--section-grid-burst-late-opacity', (0.13 * burstPoint.opacityScale).toFixed(3));
      burstElement.style.setProperty('--section-grid-burst-early-radius', `${burstPoint.earlyRadius.toFixed(2)}px`);
      burstElement.style.setProperty('--section-grid-burst-mid-radius', `${burstPoint.midRadius.toFixed(2)}px`);
      burstElement.style.setProperty('--section-grid-burst-late-radius', `${burstPoint.lateRadius.toFixed(2)}px`);
      burstElement.style.setProperty('--section-grid-burst-max-radius', `${burstPoint.maxRadius.toFixed(2)}px`);

      targetSection.appendChild(burstElement);

      const timeoutId = windowObject.setTimeout(() => {
        burstElement.remove();
        gridBurstTimeoutsRef.current.delete(burstElement);
      }, SECTION_GRID_BURST_DURATION_MS);

      gridBurstTimeoutsRef.current.set(burstElement, timeoutId);
    });
  }, []);

  const handleMainPointerDown = useCallback((event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    const mainElement = event.currentTarget;
    if (event.pointerType === 'touch') {
      const windowObject = mainElement.ownerDocument.defaultView;
      if (!windowObject) return;

      if (touchScrollGuardTimeoutRef.current) {
        windowObject.clearTimeout(touchScrollGuardTimeoutRef.current);
        touchScrollGuardTimeoutRef.current = 0;
      }

      mainElement.classList.add(TOUCH_SCROLL_GUARD_CLASS);
      mainElement.classList.remove(TOUCH_SCROLLING_CLASS);
      touchGridGestureRef.current = {
        pointerId: event.pointerId,
        pressure: event.pressure,
        startX: event.clientX,
        startY: event.clientY,
        startedAt: getTime(windowObject),
        wasScrollGesture: false
      };
      return;
    }

    triggerSectionGridBurstAtPoint({
      clientX: event.clientX,
      clientY: event.clientY,
      mainElement,
      pressure: event.pressure,
      target: event.target
    });
  }, [triggerSectionGridBurstAtPoint]);

  const handleMainPointerMove = useCallback((event) => {
    if (event.pointerType === 'touch') {
      const gesture = touchGridGestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
      if (distance > TOUCH_TAP_MAX_DISTANCE) {
        gesture.wasScrollGesture = true;
        markTouchScrolling(event.currentTarget);
      }
      return;
    }

    if (isHeroTarget(event.target)) {
      if (!heroGridOffsetResetRef.current) {
        heroGridOffsetResetRef.current = true;
        resetGridOffset();
      }
    } else {
      heroGridOffsetResetRef.current = false;
      setGridOffset(getGridOffsetXForClientX(event.currentTarget, event.clientX), 0);
    }

    lastSectionCursorPointRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      ownerDocument: event.currentTarget.ownerDocument
    };
    updateSectionCursorAtPoint(event.currentTarget.ownerDocument, event.clientX, event.clientY);
  }, [markTouchScrolling, resetGridOffset, setGridOffset, updateSectionCursorAtPoint]);

  const handleMainPointerUp = useCallback((event) => {
    if (event.pointerType !== 'touch') return;

    const mainElement = event.currentTarget;
    const windowObject = mainElement.ownerDocument.defaultView;
    const gesture = touchGridGestureRef.current;
    if (!windowObject || !gesture || gesture.pointerId !== event.pointerId) {
      scheduleTouchScrollGuardRelease(mainElement);
      return;
    }

    touchGridGestureRef.current = null;

    const now = getTime(windowObject);
    const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
    const didScrollRecently = now - lastTouchScrollAtRef.current < TOUCH_SCROLL_SETTLE_MS;
    const isDeliberateTap = (
      !gesture.wasScrollGesture
      && distance <= TOUCH_TAP_MAX_DISTANCE
      && now - gesture.startedAt <= TOUCH_TAP_MAX_DURATION_MS
      && !didScrollRecently
    );

    if (!isDeliberateTap) {
      scheduleTouchScrollGuardRelease(mainElement);
      return;
    }

    const touchedCard = getSolutionCardFromTarget(event.target);
    const isSelectedCardTap = touchedCard && touchSelectedCardRef.current === touchedCard;

    if (touchedCard) {
      selectTouchCard(touchedCard);
    } else {
      clearTouchSelectedCard();
    }

    if (!touchedCard || isSelectedCardTap) {
      triggerSectionGridBurstAtPoint({
        clientX: event.clientX,
        clientY: event.clientY,
        mainElement,
        pressure: event.pressure || gesture.pressure || 0.5,
        target: event.target
      });
    }

    scheduleTouchScrollGuardRelease(mainElement);
  }, [clearTouchSelectedCard, scheduleTouchScrollGuardRelease, selectTouchCard, triggerSectionGridBurstAtPoint]);

  const handleMainPointerCancel = useCallback((event) => {
    if (event.pointerType !== 'touch') return;

    touchGridGestureRef.current = null;
    markTouchScrolling(event.currentTarget);
  }, [markTouchScrolling]);

  useLayoutEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return undefined;

    let syncFrame = 0;
    const syncGrid = () => {
      if (syncFrame) {
        cancelAnimationFrame(syncFrame);
      }

      syncFrame = requestAnimationFrame(() => {
        syncSectionGridOrigins(mainElement);
      });
    };
    const windowObject = mainElement.ownerDocument.defaultView;
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(syncGrid);

    syncSectionGridOrigins(mainElement);
    resizeObserver?.observe(mainElement);
    mainElement.querySelectorAll('section').forEach((section) => resizeObserver?.observe(section));
    windowObject?.addEventListener('resize', syncGrid);
    windowObject?.addEventListener('load', syncGrid);

    return () => {
      if (syncFrame) {
        cancelAnimationFrame(syncFrame);
      }
      resizeObserver?.disconnect();
      windowObject?.removeEventListener('resize', syncGrid);
      windowObject?.removeEventListener('load', syncGrid);
    };
  }, []);

  useEffect(() => {
    const mainElement = mainRef.current;
    const windowObject = mainElement?.ownerDocument.defaultView;
    if (!mainElement || !windowObject) return undefined;

    let scrollFrame = 0;
    const refreshCursorOnScroll = () => {
      if (mainElement.classList.contains(TOUCH_SCROLL_GUARD_CLASS)) {
        markTouchScrolling(mainElement);
      }

      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
      }

      scrollFrame = requestAnimationFrame(() => {
        const lastPoint = lastSectionCursorPointRef.current;
        if (!lastPoint) return;

        updateSectionCursorAtPoint(lastPoint.ownerDocument, lastPoint.clientX, lastPoint.clientY);
      });
    };

    windowObject.addEventListener('scroll', refreshCursorOnScroll, { passive: true });

    return () => {
      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
      }
      windowObject.removeEventListener('scroll', refreshCursorOnScroll);
    };
  }, [markTouchScrolling, updateSectionCursorAtPoint]);

  useEffect(() => () => {
    if (gridFrameRef.current) {
      cancelAnimationFrame(gridFrameRef.current);
    }
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }
    if (touchScrollGuardTimeoutRef.current) {
      clearTimeout(touchScrollGuardTimeoutRef.current);
      touchScrollGuardTimeoutRef.current = 0;
    }
    touchGridGestureRef.current = null;
    touchSelectedCardRef.current?.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    touchSelectedCardRef.current = null;
    mainRef.current?.classList.remove(TOUCH_SCROLL_GUARD_CLASS, TOUCH_SCROLLING_CLASS);
    gridBurstTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    gridBurstTimeoutsRef.current.clear();
    mainRef.current?.querySelectorAll('.section-grid-burst').forEach((burstElement) => {
      burstElement.remove();
    });
    solutionCardBurstTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    solutionCardBurstTimeoutsRef.current.clear();
    mainRef.current?.querySelectorAll(`.${SOLUTION_CARD_BURST_ACTIVE_CLASS}`).forEach((card) => {
      card.classList.remove(SOLUTION_CARD_BURST_ACTIVE_CLASS);
    });
  }, []);

  return (
    <div onContextMenuCapture={preventImageDefault} onDragStartCapture={preventImageDefault}>
      <TopNavBar />
      <main
        ref={mainRef}
        className="site-main-with-section-cursor"
        onPointerLeave={handleMainPointerLeave}
        onPointerCancel={handleMainPointerCancel}
        onPointerDown={handleMainPointerDown}
        onPointerMove={handleMainPointerMove}
        onPointerUp={handleMainPointerUp}
      >
        <HeroSection />
        <WebSolutionsSection />
        <SoftwareSection />
        <InfrastructureSection />
        <SupportSection />
        <ContactSection />
        <div ref={sectionCursorRef} aria-hidden="true" className="section-cursor-dot" />
      </main>
      <Footer />
    </div>
  );
}
