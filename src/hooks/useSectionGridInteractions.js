import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  HERO_GRAPHIC_CURSOR_SMALL_CLASS,
  SECTION_GRID_BURST_EDGE_FEATHER,
  SECTION_GRID_BURST_MIN_INTERVAL_MS,
  SOLUTION_CARD_TOUCH_SELECTED_CLASS,
  TOUCH_SCROLL_GUARD_CLASS,
  TOUCH_SCROLLING_CLASS,
  TOUCH_SCROLL_SETTLE_MS,
  TOUCH_SELECTABLE_CARD_SELECTOR,
  TOUCH_TAP_MAX_DISTANCE,
  TOUCH_TAP_MAX_DURATION_MS
} from './sectionGrid/constants';
import {
  getCardClipRadius,
  getCardGridOriginPage,
  getGridBurstPoint,
  getGridBurstTargetCards,
  getGridBurstTargetSections,
  getSectionBurstOpacityScale,
  getSectionBurstRgb,
  getSectionGridOriginPage,
  getSectionGridSize
} from './sectionGrid/gridBurst';
import {
  createGridBurstCanvasController,
  GRID_BURST_CANVAS_DURATION_MS
} from './sectionGrid/gridBurstCanvas';
import { syncSectionGridOrigins } from './sectionGrid/gridSurface';
import { getTime, isDesktopChromium, isLikelyDesktopTrackpadPinch } from './sectionGrid/inputDetection';
import { useSectionCursor } from './sectionGrid/useSectionCursor';

export { preventImageDefault } from './sectionGrid/inputDetection';

const TOUCH_TAP_MAX_DISTANCE_SQUARED = TOUCH_TAP_MAX_DISTANCE * TOUCH_TAP_MAX_DISTANCE;

function getTouchSelectableCardFromTarget(target) {
  if (!(target instanceof Element)) return null;
  const infrastructureCard = target.closest('.infrastructure-image-card');
  if (infrastructureCard) {
    return target.closest('.infrastructure-image-frame') ? infrastructureCard : null;
  }
  return target.closest(TOUCH_SELECTABLE_CARD_SELECTOR);
}

export function useSectionGridInteractions() {
  const burstCanvasRef = useRef(null);
  const burstControllerRef = useRef(null);
  const lastGridBurstAtRef = useRef(Number.NEGATIVE_INFINITY);
  const lastTouchScrollAtRef = useRef(Number.NEGATIVE_INFINITY);
  const touchGridGestureRef = useRef(null);
  const touchScrollGuardTimeoutRef = useRef(0);
  const touchSelectedCardRef = useRef(null);
  const mainRef = useRef(null);
  const {
    sectionCursorRef,
    cleanupSectionCursor,
    clearSectionCursorPoint,
    hideSectionCursor,
    refreshSectionCursor,
    trackSectionCursorPoint
  } = useSectionCursor();

  useEffect(() => {
    const canvas = burstCanvasRef.current;
    if (!canvas) return undefined;
    const controller = createGridBurstCanvasController(canvas);
    burstControllerRef.current = controller;
    return () => {
      controller?.destroy();
      burstControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const windowObject = mainRef.current?.ownerDocument.defaultView;
    if (!windowObject || !isDesktopChromium(windowObject)) return undefined;

    const preventDesktopTrackpadPinch = (event) => {
      if (isLikelyDesktopTrackpadPinch(event, windowObject)) {
        if (event.cancelable) event.preventDefault();
      }
    };

    windowObject.addEventListener('wheel', preventDesktopTrackpadPinch, {
      capture: true,
      passive: false
    });

    return () => {
      windowObject.removeEventListener('wheel', preventDesktopTrackpadPinch, { capture: true });
    };
  }, []);

  const clearTouchSelectedCard = useCallback(() => {
    const selectedCard = touchSelectedCardRef.current;
    if (selectedCard) {
      selectedCard.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    }

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

    event.currentTarget.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
    clearSectionCursorPoint();
    hideSectionCursor();
  }, [clearSectionCursorPoint, hideSectionCursor, scheduleTouchScrollGuardRelease]);

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

    const windowObject = mainElement.ownerDocument.defaultView;
    const controller = burstControllerRef.current;
    if (!windowObject || !controller) return;

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
      target,
      clientX,
      clientY,
      burstOuterRadius
    );

    const scrollX = windowObject.scrollX || 0;
    const scrollY = windowObject.scrollY || 0;
    const pageX = clientX + scrollX;
    const pageY = clientY + scrollY;

    /* Section bursts: aligned to each section's grid origin. We emit one
       burst per affected section so cross-boundary clicks fade smoothly into
       neighbors using each neighbor's color, exactly like the previous DOM
       implementation did. */
    targetSections.forEach((targetSection) => {
      const rgb = getSectionBurstRgb(targetSection);
      const intensity = burstPoint.opacityScale * getSectionBurstOpacityScale(targetSection);
      const gridSize = getSectionGridSize(targetSection);
      const origin = getSectionGridOriginPage(targetSection);
      const sectionRect = targetSection.getBoundingClientRect();
      controller.addBurst({
        pageX,
        pageY,
        rgb,
        maxRadius: burstPoint.maxRadius,
        intensity,
        gridSize,
        gridOriginX: origin.x,
        gridOriginY: origin.y,
        clipRect: {
          left: sectionRect.left + scrollX,
          top: sectionRect.top + scrollY,
          right: sectionRect.right + scrollX,
          bottom: sectionRect.bottom + scrollY,
          radius: 0
        },
        startTime: windowObject.performance.now(),
        duration: GRID_BURST_CANVAS_DURATION_MS
      });
    });

    /* Card bursts: per-card grid origin and rounded clip so the bright grid
       lines stay contained within the card's silhouette. */
    targetCards.forEach((card) => {
      const cardSection = card.closest('section.section-grid-bg');
      const sectionRgb = cardSection ? getSectionBurstRgb(cardSection) : undefined;
      if (!sectionRgb) return;
      const intensity = burstPoint.opacityScale
        * (cardSection ? getSectionBurstOpacityScale(cardSection) : 1)
        * 0.55;
      const sectionOrigin = cardSection ? getSectionGridOriginPage(cardSection) : { x: 0, y: 0 };
      const cardOrigin = getCardGridOriginPage(card, sectionOrigin);
      const gridSize = cardSection ? getSectionGridSize(cardSection) : 72;
      const cardRect = card.getBoundingClientRect();
      controller.addBurst({
        pageX,
        pageY,
        rgb: sectionRgb,
        maxRadius: burstPoint.maxRadius * 0.6,
        intensity,
        gridSize,
        gridOriginX: cardOrigin.x,
        gridOriginY: cardOrigin.y,
        clipRect: {
          left: cardRect.left + scrollX,
          top: cardRect.top + scrollY,
          right: cardRect.right + scrollX,
          bottom: cardRect.bottom + scrollY,
          radius: getCardClipRadius(card)
        },
        startTime: windowObject.performance.now(),
        duration: GRID_BURST_CANVAS_DURATION_MS
      });
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

      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;
      if (distanceSquared > TOUCH_TAP_MAX_DISTANCE_SQUARED) {
        if (!gesture.wasScrollGesture) {
          gesture.wasScrollGesture = true;
          markTouchScrolling(event.currentTarget);
          return;
        }

        const windowObject = event.currentTarget.ownerDocument.defaultView;
        if (!windowObject) return;

        lastTouchScrollAtRef.current = getTime(windowObject);
        scheduleTouchScrollGuardRelease(event.currentTarget);
      }
      return;
    }

    trackSectionCursorPoint(event.currentTarget, event.clientX, event.clientY);
  }, [markTouchScrolling, scheduleTouchScrollGuardRelease, trackSectionCursorPoint]);

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
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const didScrollRecently = now - lastTouchScrollAtRef.current < TOUCH_SCROLL_SETTLE_MS;
    const isDeliberateTap = (
      !gesture.wasScrollGesture
      && distanceSquared <= TOUCH_TAP_MAX_DISTANCE_SQUARED
      && now - gesture.startedAt <= TOUCH_TAP_MAX_DURATION_MS
      && !didScrollRecently
    );

    if (!isDeliberateTap) {
      scheduleTouchScrollGuardRelease(mainElement);
      return;
    }

    const touchedCard = getTouchSelectableCardFromTarget(event.target);
    const isSelectedCardTap = touchedCard && touchSelectedCardRef.current === touchedCard;
    const isInfrastructureCard = touchedCard?.classList.contains('infrastructure-image-card');

    if (touchedCard) {
      selectTouchCard(touchedCard);
    } else {
      clearTouchSelectedCard();
    }

    if ((!touchedCard || isSelectedCardTap) && !isInfrastructureCard) {
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
        syncFrame = 0;
        syncSectionGridOrigins(mainElement);
      });
    };
    const windowObject = mainElement.ownerDocument.defaultView;
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(syncGrid);

    syncSectionGridOrigins(mainElement);
    resizeObserver?.observe(mainElement);
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

    const refreshCursorOnScroll = () => {
      if (mainElement.classList.contains(TOUCH_SCROLL_GUARD_CLASS)) {
        markTouchScrolling(mainElement);
      }

      refreshSectionCursor(mainElement);
    };

    windowObject.addEventListener('scroll', refreshCursorOnScroll, { passive: true });

    return () => {
      windowObject.removeEventListener('scroll', refreshCursorOnScroll);
    };
  }, [markTouchScrolling, refreshSectionCursor]);

  useEffect(() => () => {
    cleanupSectionCursor();
    if (touchScrollGuardTimeoutRef.current) {
      clearTimeout(touchScrollGuardTimeoutRef.current);
      touchScrollGuardTimeoutRef.current = 0;
    }
    touchGridGestureRef.current = null;
    touchSelectedCardRef.current?.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    touchSelectedCardRef.current = null;
    mainRef.current?.classList.remove(
      TOUCH_SCROLL_GUARD_CLASS,
      TOUCH_SCROLLING_CLASS,
      HERO_GRAPHIC_CURSOR_SMALL_CLASS
    );
    burstControllerRef.current?.clear();
  }, [cleanupSectionCursor]);

  return {
    mainRef,
    sectionCursorRef,
    burstCanvasRef,
    mainEventHandlers: {
      onPointerLeave: handleMainPointerLeave,
      onPointerCancel: handleMainPointerCancel,
      onPointerDown: handleMainPointerDown,
      onPointerMove: handleMainPointerMove,
      onPointerUp: handleMainPointerUp
    }
  };
}
