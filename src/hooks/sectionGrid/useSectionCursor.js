import { useCallback, useRef } from 'react';
import { CARD_GRID_ANCHOR_SELECTOR } from './constants';
import { getSectionCursorTheme } from './cursorTheme';
import { clearCardGridHighlight, updateCardGridHighlight } from './gridSurface';
import { updateHeroGraphicCursorState } from './heroGraphicHitTest';

export function useSectionCursor() {
  const sectionCursorFrameRef = useRef(0);
  const sectionCursorFrameKindRef = useRef(null);
  const lastSectionCursorPointRef = useRef(null);
  const highlightedSectionsRef = useRef([]);
  const highlightedCardGridAnchorsRef = useRef([]);
  const sectionCursorRef = useRef(null);

  const clearSectionHighlights = useCallback(() => {
    highlightedSectionsRef.current.forEach((section) => {
      section.style.setProperty('--section-grid-highlight-opacity', '0');
    });
    highlightedSectionsRef.current = [];
    highlightedCardGridAnchorsRef.current.forEach(clearCardGridHighlight);
    highlightedCardGridAnchorsRef.current = [];
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

    const {
      clientX,
      clientY,
      mainElement,
      ownerDocument
    } = latestPoint;

    updateHeroGraphicCursorState(mainElement, clientX, clientY);

    const theme = getSectionCursorTheme(ownerDocument, clientY);
    if (!theme) {
      clearSectionHighlights();
      return;
    }

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

    const nextHighlightedCardGridAnchors = new Set();
    theme.highlights.forEach(({ section, color, opacity }) => {
      section.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR).forEach((card) => {
        updateCardGridHighlight(card, clientX, clientY, color, opacity);
        nextHighlightedCardGridAnchors.add(card);
      });
    });
    highlightedCardGridAnchorsRef.current.forEach((card) => {
      if (!nextHighlightedCardGridAnchors.has(card)) {
        clearCardGridHighlight(card);
      }
    });
    highlightedCardGridAnchorsRef.current = Array.from(nextHighlightedCardGridAnchors);

    cursorElement.style.setProperty('--section-cursor-x', `${clientX}px`);
    cursorElement.style.setProperty('--section-cursor-y', `${clientY}px`);
    cursorElement.style.setProperty('--section-cursor-top-color', theme.topColor);
    cursorElement.style.setProperty('--section-cursor-bottom-color', theme.bottomColor);
    cursorElement.style.setProperty('--section-cursor-split', theme.split);
    cursorElement.style.setProperty('--section-cursor-opacity', '1');
  }, [clearSectionHighlights]);

  const scheduleSectionCursorUpdate = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      if (sectionCursorFrameKindRef.current === 'update') return;

      cancelAnimationFrame(sectionCursorFrameRef.current);
      sectionCursorFrameRef.current = 0;
    }

    sectionCursorFrameKindRef.current = 'update';
    sectionCursorFrameRef.current = requestAnimationFrame(updateSectionCursorAtLatestPoint);
  }, [updateSectionCursorAtLatestPoint]);

  const trackSectionCursorPoint = useCallback((mainElement, clientX, clientY) => {
    lastSectionCursorPointRef.current = {
      clientX,
      clientY,
      mainElement,
      ownerDocument: mainElement.ownerDocument
    };
    scheduleSectionCursorUpdate();
  }, [scheduleSectionCursorUpdate]);

  const refreshSectionCursor = useCallback((mainElement) => {
    const lastPoint = lastSectionCursorPointRef.current;
    if (!lastPoint) return;

    lastSectionCursorPointRef.current = {
      ...lastPoint,
      mainElement
    };
    scheduleSectionCursorUpdate();
  }, [scheduleSectionCursorUpdate]);

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
    clearSectionHighlights();
  }, [clearSectionHighlights]);

  return {
    sectionCursorRef,
    cleanupSectionCursor,
    clearSectionCursorPoint,
    hideSectionCursor,
    refreshSectionCursor,
    trackSectionCursorPoint
  };
}
