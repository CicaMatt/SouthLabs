import { useCallback, useRef } from 'react';
import {
  SECTION_CURSOR_DOT_SIZE,
  buildSectionCursorLayout,
  getSectionCursorTheme
} from './cursorTheme';
import {
  SECTION_CURSOR_COMPACT_CLASS,
  SECTION_CURSOR_COMPACT_TARGET_SELECTOR,
  SECTION_CURSOR_NATIVE_CLASS,
  SECTION_CURSOR_NATIVE_TARGET_SELECTOR
} from './domSelectors';
import { clearCardGridHighlight, updateCardGridHighlight } from './gridSurface';
import { setStylePropertyIfChanged } from '../../lib/dom';
import { readHeroGraphicCursorLayout, updateHeroGraphicCursorState } from './heroGraphicHitTest';
import { DEFAULT_SECTION_GRID_SIZE } from './useSectionGridInteractions';

const SECTION_CURSOR_COMPACT_DOT_SIZE = 10;

/* Cursor position within one grid cell, used to counter-shift the spotlight's
   inner grid so it stays page-locked while the masked window slides. The inner
   grid extends a whole-cell multiple past the window, so a plain `value mod cell`
   is the exact phase (no window/2 term needed). */
function gridCellPhase(value, cellSize) {
  const cell = cellSize || DEFAULT_SECTION_GRID_SIZE;
  return (((value % cell) + cell) % cell).toFixed(2);
}

function getPointerTargetElement(target) {
  return target instanceof Element ? target : null;
}

function updatePointerTargetCursorState(mainElement, target, forceCompact = false) {
  const targetElement = getPointerTargetElement(target);
  const usesNativeCursor = Boolean(targetElement?.closest(SECTION_CURSOR_NATIVE_TARGET_SELECTOR));
  const isCompact =
    !usesNativeCursor &&
    (forceCompact || Boolean(targetElement?.closest(SECTION_CURSOR_COMPACT_TARGET_SELECTOR)));

  mainElement.classList.toggle(SECTION_CURSOR_NATIVE_CLASS, usesNativeCursor);
  mainElement.classList.toggle(SECTION_CURSOR_COMPACT_CLASS, isCompact);

  return { isCompact, usesNativeCursor };
}

export function useSectionCursor() {
  const sectionCursorFrameRef = useRef(0);
  const sectionCursorFrameKindRef = useRef(null);
  const lastSectionCursorPointRef = useRef(null);
  const highlightedSectionsRef = useRef([]);
  const highlightedCardGridAnchorsRef = useRef(new Set());
  const sectionCursorRef = useRef(null);
  const sectionCursorLayoutRef = useRef(null);

  const measureSectionCursorLayout = useCallback((mainElement) => {
    const ownerDocument = mainElement?.ownerDocument;
    if (!ownerDocument) {
      sectionCursorLayoutRef.current = null;
      return null;
    }

    const layout = {
      ...buildSectionCursorLayout(ownerDocument),
      heroGraphic: readHeroGraphicCursorLayout(mainElement)
    };
    sectionCursorLayoutRef.current = layout;
    return layout;
  }, []);

  const getSectionCursorLayout = useCallback(
    (mainElement) => sectionCursorLayoutRef.current ?? measureSectionCursorLayout(mainElement),
    [measureSectionCursorLayout]
  );

  const clearSectionHighlights = useCallback(() => {
    highlightedSectionsRef.current.forEach((section) => {
      setStylePropertyIfChanged(section, '--section-grid-highlight-opacity', '0');
    });
    highlightedSectionsRef.current = [];
    highlightedCardGridAnchorsRef.current.forEach(clearCardGridHighlight);
    highlightedCardGridAnchorsRef.current = new Set();
    if (sectionCursorRef.current) {
      setStylePropertyIfChanged(sectionCursorRef.current, '--section-cursor-opacity', '0');
    }
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

    const { clientX, clientY, mainElement, target } = latestPoint;

    const windowObject = mainElement.ownerDocument.defaultView;
    const pageX = clientX + (windowObject?.scrollX || 0);
    const pageY = clientY + (windowObject?.scrollY || 0);
    const layout = getSectionCursorLayout(mainElement);
    const isOverHeroGraphic = updateHeroGraphicCursorState(
      mainElement,
      layout?.heroGraphic,
      pageX,
      pageY
    );
    const cursorTargetState = updatePointerTargetCursorState(
      mainElement,
      target,
      isOverHeroGraphic
    );
    const dotSize = cursorTargetState.isCompact
      ? SECTION_CURSOR_COMPACT_DOT_SIZE
      : SECTION_CURSOR_DOT_SIZE;
    const theme = getSectionCursorTheme(layout, pageX, pageY, dotSize);
    if (!theme) {
      clearSectionHighlights();
      return;
    }

    const nextHighlightedSections = theme.highlights.map(({ section }) => section);
    highlightedSectionsRef.current.forEach((section) => {
      if (!nextHighlightedSections.includes(section)) {
        setStylePropertyIfChanged(section, '--section-grid-highlight-opacity', '0');
      }
    });

    theme.highlights.forEach(({ section, color, opacity, rect, gridSize }) => {
      const localX = pageX - rect.left;
      const localY = pageY - rect.top;
      section.style.setProperty('--section-grid-highlight-x', `${localX.toFixed(2)}px`);
      section.style.setProperty('--section-grid-highlight-y', `${localY.toFixed(2)}px`);
      section.style.setProperty('--spotlight-phase-x', gridCellPhase(localX, gridSize));
      section.style.setProperty('--spotlight-phase-y', gridCellPhase(localY, gridSize));
      setStylePropertyIfChanged(section, '--section-grid-highlight-color', color);
      setStylePropertyIfChanged(section, '--section-grid-highlight-opacity', opacity.toFixed(3));
    });
    highlightedSectionsRef.current = nextHighlightedSections;

    const nextHighlightedCardGridAnchors = new Set();
    theme.highlights.forEach(({ cardAnchors, color, opacity, gridSize }) => {
      cardAnchors.forEach(({ color: cardColor, element: card, rect }) => {
        updateCardGridHighlight(card, pageX, pageY, cardColor || color, opacity, rect, gridSize);
        nextHighlightedCardGridAnchors.add(card);
      });
    });
    highlightedCardGridAnchorsRef.current.forEach((card) => {
      if (!nextHighlightedCardGridAnchors.has(card)) {
        clearCardGridHighlight(card);
      }
    });
    highlightedCardGridAnchorsRef.current = nextHighlightedCardGridAnchors;

    cursorElement.style.transform = `translate3d(${clientX.toFixed(2)}px, ${clientY.toFixed(
      2
    )}px, 0) translate(-50%, -50%)`;
    setStylePropertyIfChanged(cursorElement, '--section-cursor-top-color', theme.topColor);
    setStylePropertyIfChanged(cursorElement, '--section-cursor-bottom-color', theme.bottomColor);
    setStylePropertyIfChanged(cursorElement, '--section-cursor-split', theme.split);
    setStylePropertyIfChanged(cursorElement, '--section-cursor-zone-color', theme.zoneColor);
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-inset-top',
      `${theme.zoneInsetTop.toFixed(2)}%`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-inset-right',
      `${theme.zoneInsetRight.toFixed(2)}%`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-inset-bottom',
      `${theme.zoneInsetBottom.toFixed(2)}%`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-inset-left',
      `${theme.zoneInsetLeft.toFixed(2)}%`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-radius-tl',
      `${theme.zoneRadiusTopLeft.toFixed(2)}px`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-radius-tr',
      `${theme.zoneRadiusTopRight.toFixed(2)}px`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-radius-br',
      `${theme.zoneRadiusBottomRight.toFixed(2)}px`
    );
    setStylePropertyIfChanged(
      cursorElement,
      '--section-cursor-zone-radius-bl',
      `${theme.zoneRadiusBottomLeft.toFixed(2)}px`
    );
    setStylePropertyIfChanged(cursorElement, '--section-cursor-opacity', '1');
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
    (mainElement, clientX, clientY, target) => {
      lastSectionCursorPointRef.current = {
        clientX,
        clientY,
        mainElement,
        target
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
