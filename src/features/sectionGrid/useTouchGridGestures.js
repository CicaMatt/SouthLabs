import { useCallback, useRef } from 'react';
import { getTime } from './inputDetection';
import {
  SOLUTION_CARD_TOUCH_SELECTED_CLASS,
  TOUCH_SCROLL_GUARD_CLASS,
  TOUCH_SCROLLING_CLASS,
  TOUCH_SELECTABLE_CARD_SELECTOR
} from './domSelectors';

const TOUCH_TAP_MAX_DISTANCE = 10;
const TOUCH_TAP_MAX_DURATION_MS = 650;
const TOUCH_SCROLL_SETTLE_MS = 220;
const TOUCH_TAP_MAX_DISTANCE_SQUARED = TOUCH_TAP_MAX_DISTANCE * TOUCH_TAP_MAX_DISTANCE;

function getTouchSelectableCardFromTarget(target) {
  if (!(target instanceof Element)) return null;

  const infrastructureCard = target.closest('.infrastructure-image-card');
  if (infrastructureCard) {
    return target.closest('.infrastructure-image-frame') ? infrastructureCard : null;
  }

  return target.closest(TOUCH_SELECTABLE_CARD_SELECTOR);
}

export function useTouchGridGestures({ triggerSectionGridBurstAtPoint }) {
  const lastTouchScrollAtRef = useRef(Number.NEGATIVE_INFINITY);
  const touchGridGestureRef = useRef(null);
  const touchScrollGuardTimeoutRef = useRef(0);
  const touchSelectedCardRef = useRef(null);

  const clearTouchSelectedCard = useCallback(() => {
    const selectedCard = touchSelectedCardRef.current;
    if (selectedCard) {
      selectedCard.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    }

    touchSelectedCardRef.current = null;
  }, []);

  const selectTouchCard = useCallback(
    (card) => {
      if (!card) {
        clearTouchSelectedCard();
        return;
      }

      if (touchSelectedCardRef.current && touchSelectedCardRef.current !== card) {
        touchSelectedCardRef.current.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
      }

      card.classList.add(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
      touchSelectedCardRef.current = card;
    },
    [clearTouchSelectedCard]
  );

  const scheduleTouchScrollGuardRelease = useCallback(
    (mainElement, delay = TOUCH_SCROLL_SETTLE_MS) => {
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
    },
    []
  );

  const markTouchScrolling = useCallback(
    (mainElement) => {
      const windowObject = mainElement.ownerDocument.defaultView;
      if (!windowObject) return;

      lastTouchScrollAtRef.current = getTime(windowObject);
      clearTouchSelectedCard();
      mainElement.classList.add(TOUCH_SCROLL_GUARD_CLASS, TOUCH_SCROLLING_CLASS);
      scheduleTouchScrollGuardRelease(mainElement);
    },
    [clearTouchSelectedCard, scheduleTouchScrollGuardRelease]
  );

  const handleTouchPointerLeave = useCallback(
    (event) => {
      if (event.pointerType !== 'touch') return false;

      touchGridGestureRef.current = null;
      scheduleTouchScrollGuardRelease(event.currentTarget);
      return true;
    },
    [scheduleTouchScrollGuardRelease]
  );

  const handleTouchPointerDown = useCallback((event) => {
    if (event.pointerType !== 'touch') return false;

    const mainElement = event.currentTarget;
    const windowObject = mainElement.ownerDocument.defaultView;
    if (!windowObject) return true;

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

    return true;
  }, []);

  const handleTouchPointerMove = useCallback(
    (event) => {
      if (event.pointerType !== 'touch') return false;

      const gesture = touchGridGestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return true;

      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;
      if (distanceSquared > TOUCH_TAP_MAX_DISTANCE_SQUARED) {
        if (!gesture.wasScrollGesture) {
          gesture.wasScrollGesture = true;
          markTouchScrolling(event.currentTarget);
          return true;
        }

        const windowObject = event.currentTarget.ownerDocument.defaultView;
        if (!windowObject) return true;

        lastTouchScrollAtRef.current = getTime(windowObject);
        scheduleTouchScrollGuardRelease(event.currentTarget);
      }

      return true;
    },
    [markTouchScrolling, scheduleTouchScrollGuardRelease]
  );

  const handleTouchPointerUp = useCallback(
    (event) => {
      if (event.pointerType !== 'touch') return false;

      const mainElement = event.currentTarget;
      const windowObject = mainElement.ownerDocument.defaultView;
      const gesture = touchGridGestureRef.current;
      if (!windowObject || !gesture || gesture.pointerId !== event.pointerId) {
        scheduleTouchScrollGuardRelease(mainElement);
        return true;
      }

      touchGridGestureRef.current = null;

      const now = getTime(windowObject);
      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;
      const didScrollRecently = now - lastTouchScrollAtRef.current < TOUCH_SCROLL_SETTLE_MS;
      const isDeliberateTap =
        !gesture.wasScrollGesture &&
        distanceSquared <= TOUCH_TAP_MAX_DISTANCE_SQUARED &&
        now - gesture.startedAt <= TOUCH_TAP_MAX_DURATION_MS &&
        !didScrollRecently;

      if (!isDeliberateTap) {
        scheduleTouchScrollGuardRelease(mainElement);
        return true;
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
      return true;
    },
    [
      clearTouchSelectedCard,
      scheduleTouchScrollGuardRelease,
      selectTouchCard,
      triggerSectionGridBurstAtPoint
    ]
  );

  const handleTouchPointerCancel = useCallback(
    (event) => {
      if (event.pointerType !== 'touch') return false;

      touchGridGestureRef.current = null;
      markTouchScrolling(event.currentTarget);
      return true;
    },
    [markTouchScrolling]
  );

  const cleanupTouchGridGestures = useCallback((mainElement) => {
    if (touchScrollGuardTimeoutRef.current) {
      clearTimeout(touchScrollGuardTimeoutRef.current);
      touchScrollGuardTimeoutRef.current = 0;
    }

    touchGridGestureRef.current = null;
    touchSelectedCardRef.current?.classList.remove(SOLUTION_CARD_TOUCH_SELECTED_CLASS);
    touchSelectedCardRef.current = null;
    mainElement?.classList.remove(TOUCH_SCROLL_GUARD_CLASS, TOUCH_SCROLLING_CLASS);
  }, []);

  return {
    cleanupTouchGridGestures,
    handleTouchPointerCancel,
    handleTouchPointerDown,
    handleTouchPointerLeave,
    handleTouchPointerMove,
    handleTouchPointerUp,
    markTouchScrolling
  };
}
