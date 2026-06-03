import { useCallback, useRef } from 'react';
import { buildSectionCursorLayout, getSectionCursorTheme } from './cursorTheme';
import { HERO_GRAPHIC_CURSOR_SMALL_CLASS, SECTION_CURSOR_SMALL_CLASS } from './selectors';
import { updateHeroGraphicCursorState } from './heroGraphicHitTest';

const DEFAULT_SECTION_CURSOR_SIZE = 20;
const SMALL_SECTION_CURSOR_SIZE = 10;

function getSectionCursorDotSize(mainElement) {
  return mainElement.classList.contains(SECTION_CURSOR_SMALL_CLASS) ||
    mainElement.classList.contains(HERO_GRAPHIC_CURSOR_SMALL_CLASS)
    ? SMALL_SECTION_CURSOR_SIZE
    : DEFAULT_SECTION_CURSOR_SIZE;
}

export function useSectionCursor() {
  const sectionCursorFrameRef = useRef(0);
  const sectionCursorFrameKindRef = useRef(null);
  const lastSectionCursorPointRef = useRef(null);
  const sectionCursorRef = useRef(null);
  const sectionCursorLayoutRef = useRef(null);

  const measureSectionCursorLayout = useCallback((mainElement) => {
    const ownerDocument = mainElement?.ownerDocument;
    if (!ownerDocument) {
      sectionCursorLayoutRef.current = null;
      return null;
    }

    const layout = buildSectionCursorLayout(ownerDocument);
    sectionCursorLayoutRef.current = layout;
    return layout;
  }, []);

  const getSectionCursorLayout = useCallback(
    (mainElement) => sectionCursorLayoutRef.current ?? measureSectionCursorLayout(mainElement),
    [measureSectionCursorLayout]
  );

  const clearSectionHighlights = useCallback(() => {
    sectionCursorRef.current?.style.setProperty('--section-cursor-opacity', '0');
  }, []);

  const hideSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
      sectionCursorFrameRef.current = 0;
      sectionCursorFrameKindRef.current = null;
    }

    sectionCursorFrameKindRef.current = 'clear';
    sectionCursorFrameRef.current = requestAnimationFrame(() => {
      sectionCursorFrameRef.current = 0;
      sectionCursorFrameKindRef.current = null;
      clearSectionHighlights();
    });
  }, [clearSectionHighlights]);

  const updateSectionCursorAtLatestPoint = useCallback(() => {
    sectionCursorFrameRef.current = 0;
    sectionCursorFrameKindRef.current = null;

    const cursorElement = sectionCursorRef.current;
    const latestPoint = lastSectionCursorPointRef.current;
    if (!cursorElement || !latestPoint) return;

    const { clientX, clientY, mainElement } = latestPoint;

    const windowObject = mainElement.ownerDocument.defaultView;
    const pageX = clientX + (windowObject?.scrollX || 0);
    const pageY = clientY + (windowObject?.scrollY || 0);
    const dotSize = getSectionCursorDotSize(mainElement);
    const layout = getSectionCursorLayout(mainElement);
    const theme = getSectionCursorTheme(layout, pageX, pageY, dotSize);
    if (!theme) {
      mainElement.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
      clearSectionHighlights();
      return;
    }

    if (theme.currentSection?.id === 'hero') {
      updateHeroGraphicCursorState(mainElement, clientX, clientY);
    } else {
      mainElement.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
    }

    cursorElement.style.setProperty('--section-cursor-x', `${clientX}px`);
    cursorElement.style.setProperty('--section-cursor-y', `${clientY}px`);
    cursorElement.style.setProperty('--section-cursor-top-color', theme.topColor);
    cursorElement.style.setProperty('--section-cursor-bottom-color', theme.bottomColor);
    cursorElement.style.setProperty('--section-cursor-split', theme.split);
    cursorElement.style.setProperty('--section-cursor-zone-color', theme.zoneColor);
    cursorElement.style.setProperty(
      '--section-cursor-zone-inset-top',
      `${theme.zoneInsetTop.toFixed(2)}%`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-inset-right',
      `${theme.zoneInsetRight.toFixed(2)}%`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-inset-bottom',
      `${theme.zoneInsetBottom.toFixed(2)}%`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-inset-left',
      `${theme.zoneInsetLeft.toFixed(2)}%`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-radius-tl',
      `${theme.zoneRadiusTopLeft.toFixed(2)}px`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-radius-tr',
      `${theme.zoneRadiusTopRight.toFixed(2)}px`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-radius-br',
      `${theme.zoneRadiusBottomRight.toFixed(2)}px`
    );
    cursorElement.style.setProperty(
      '--section-cursor-zone-radius-bl',
      `${theme.zoneRadiusBottomLeft.toFixed(2)}px`
    );
    cursorElement.style.setProperty('--section-cursor-opacity', '1');
  }, [clearSectionHighlights, getSectionCursorLayout]);

  const scheduleSectionCursorUpdate = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      if (sectionCursorFrameKindRef.current === 'update') return;

      cancelAnimationFrame(sectionCursorFrameRef.current);
      sectionCursorFrameRef.current = 0;
    }

    sectionCursorFrameKindRef.current = 'update';
    sectionCursorFrameRef.current = requestAnimationFrame(updateSectionCursorAtLatestPoint);
  }, [updateSectionCursorAtLatestPoint]);

  const trackSectionCursorPoint = useCallback(
    (mainElement, clientX, clientY) => {
      lastSectionCursorPointRef.current = {
        clientX,
        clientY,
        mainElement
      };
      scheduleSectionCursorUpdate();
    },
    [scheduleSectionCursorUpdate]
  );

  const refreshSectionCursor = useCallback(
    (mainElement) => {
      sectionCursorLayoutRef.current = null;

      const lastPoint = lastSectionCursorPointRef.current;
      if (!lastPoint) return;

      measureSectionCursorLayout(mainElement);
      lastSectionCursorPointRef.current = {
        ...lastPoint,
        mainElement
      };
      scheduleSectionCursorUpdate();
    },
    [measureSectionCursorLayout, scheduleSectionCursorUpdate]
  );

  const updateSectionCursor = useCallback(
    (mainElement) => {
      const lastPoint = lastSectionCursorPointRef.current;
      if (!lastPoint) return;

      lastSectionCursorPointRef.current = {
        ...lastPoint,
        mainElement
      };
      scheduleSectionCursorUpdate();
    },
    [scheduleSectionCursorUpdate]
  );

  const refreshSectionCursorLayout = useCallback(
    (mainElement) => {
      measureSectionCursorLayout(mainElement);
    },
    [measureSectionCursorLayout]
  );

  const clearSectionCursorPoint = useCallback(() => {
    lastSectionCursorPointRef.current = null;
  }, []);

  const cleanupSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
      sectionCursorFrameRef.current = 0;
    }
    sectionCursorFrameKindRef.current = null;
    lastSectionCursorPointRef.current = null;
    sectionCursorLayoutRef.current = null;
    clearSectionHighlights();
  }, [clearSectionHighlights]);

  return {
    sectionCursorRef,
    cleanupSectionCursor,
    clearSectionCursorPoint,
    hideSectionCursor,
    refreshSectionCursor,
    refreshSectionCursorLayout,
    trackSectionCursorPoint,
    updateSectionCursor
  };
}
