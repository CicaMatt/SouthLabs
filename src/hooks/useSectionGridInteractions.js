import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { HERO_GRAPHIC_CURSOR_SMALL_CLASS, TOUCH_SCROLL_GUARD_CLASS } from './sectionGrid/selectors';
import { syncSectionGridOrigins } from './sectionGrid/gridSurface';
import { useDesktopPinchGuard } from './sectionGrid/useDesktopPinchGuard';
import { useSectionCursor } from './sectionGrid/useSectionCursor';
import { useSectionGridBurst } from './sectionGrid/useSectionGridBurst';
import { useTouchGridGestures } from './sectionGrid/useTouchGridGestures';

export { preventImageDefault } from './sectionGrid/inputDetection';

export function useSectionGridInteractions() {
  const mainRef = useRef(null);
  const {
    sectionCursorRef,
    cleanupSectionCursor,
    clearSectionCursorPoint,
    hideSectionCursor,
    refreshSectionCursor,
    refreshSectionCursorLayout,
    trackSectionCursorPoint,
    updateSectionCursor
  } = useSectionCursor();
  const { burstCanvasRef, clearGridBursts, triggerSectionGridBurstAtPoint } = useSectionGridBurst();
  const {
    cleanupTouchGridGestures,
    handleTouchPointerCancel,
    handleTouchPointerDown,
    handleTouchPointerLeave,
    handleTouchPointerMove,
    handleTouchPointerUp,
    markTouchScrolling
  } = useTouchGridGestures({ triggerSectionGridBurstAtPoint });

  useDesktopPinchGuard(mainRef);

  const handleMainPointerLeave = useCallback(
    (event) => {
      if (handleTouchPointerLeave(event)) return;

      event.currentTarget.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
      clearSectionCursorPoint();
      hideSectionCursor();
    },
    [clearSectionCursorPoint, handleTouchPointerLeave, hideSectionCursor]
  );

  const handleMainPointerDown = useCallback(
    (event) => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      if (handleTouchPointerDown(event)) return;

      triggerSectionGridBurstAtPoint({
        clientX: event.clientX,
        clientY: event.clientY,
        mainElement: event.currentTarget,
        pressure: event.pressure,
        target: event.target
      });
    },
    [handleTouchPointerDown, triggerSectionGridBurstAtPoint]
  );

  const handleMainPointerMove = useCallback(
    (event) => {
      if (handleTouchPointerMove(event)) return;

      trackSectionCursorPoint(event.currentTarget, event.clientX, event.clientY);
    },
    [handleTouchPointerMove, trackSectionCursorPoint]
  );

  const handleMainPointerUp = useCallback(
    (event) => {
      handleTouchPointerUp(event);
    },
    [handleTouchPointerUp]
  );

  const handleMainPointerCancel = useCallback(
    (event) => {
      handleTouchPointerCancel(event);
    },
    [handleTouchPointerCancel]
  );

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
        refreshSectionCursor(mainElement);
      });
    };
    const windowObject = mainElement.ownerDocument.defaultView;
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncGrid);

    syncSectionGridOrigins(mainElement);
    refreshSectionCursorLayout(mainElement);
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
  }, [refreshSectionCursor, refreshSectionCursorLayout]);

  useEffect(() => {
    const mainElement = mainRef.current;
    const windowObject = mainElement?.ownerDocument.defaultView;
    if (!mainElement || !windowObject) return undefined;

    let scrollRefreshFrame = 0;
    const updateCursorOnScroll = () => {
      if (mainElement.classList.contains(TOUCH_SCROLL_GUARD_CLASS)) {
        markTouchScrolling(mainElement);
      }

      if (scrollRefreshFrame) return;

      scrollRefreshFrame = windowObject.requestAnimationFrame(() => {
        scrollRefreshFrame = 0;
        updateSectionCursor(mainElement);
      });
    };

    windowObject.addEventListener('scroll', updateCursorOnScroll, { passive: true });

    return () => {
      if (scrollRefreshFrame) {
        windowObject.cancelAnimationFrame(scrollRefreshFrame);
      }
      windowObject.removeEventListener('scroll', updateCursorOnScroll);
    };
  }, [markTouchScrolling, updateSectionCursor]);

  useEffect(
    () => () => {
      cleanupSectionCursor();
      cleanupTouchGridGestures(mainRef.current);
      mainRef.current?.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
      clearGridBursts();
    },
    [cleanupSectionCursor, cleanupTouchGridGestures, clearGridBursts]
  );

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
