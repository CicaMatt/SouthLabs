import { useCallback, useRef } from 'react';
import { SITE_GRID_THROUGH_SELECTOR } from './constants';
import {
  clearGridThroughCardHighlight,
  getSectionCursorTheme,
  updateGridThroughCardHighlight,
  updateHeroGraphicCursorState
} from './interactionUtils';

export function useSectionCursor() {
  const sectionCursorFrameRef = useRef(0);
  const lastSectionCursorPointRef = useRef(null);
  const highlightedSectionsRef = useRef([]);
  const highlightedGridThroughCardsRef = useRef([]);
  const sectionCursorRef = useRef(null);

  const clearSectionHighlights = useCallback(() => {
    highlightedSectionsRef.current.forEach((section) => {
      section.style.setProperty('--section-grid-highlight-opacity', '0');
    });
    highlightedSectionsRef.current = [];
    highlightedGridThroughCardsRef.current.forEach(clearGridThroughCardHighlight);
    highlightedGridThroughCardsRef.current = [];
    sectionCursorRef.current?.style.setProperty('--section-cursor-opacity', '0');
  }, []);

  const hideSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }

    sectionCursorFrameRef.current = requestAnimationFrame(clearSectionHighlights);
  }, [clearSectionHighlights]);

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

  const trackSectionCursorPoint = useCallback((mainElement, clientX, clientY) => {
    updateHeroGraphicCursorState(mainElement, clientX, clientY);
    lastSectionCursorPointRef.current = {
      clientX,
      clientY,
      ownerDocument: mainElement.ownerDocument
    };
    updateSectionCursorAtPoint(mainElement.ownerDocument, clientX, clientY);
  }, [updateSectionCursorAtPoint]);

  const refreshSectionCursor = useCallback((mainElement) => {
    const lastPoint = lastSectionCursorPointRef.current;
    if (!lastPoint) return;

    updateHeroGraphicCursorState(mainElement, lastPoint.clientX, lastPoint.clientY);
    updateSectionCursorAtPoint(lastPoint.ownerDocument, lastPoint.clientX, lastPoint.clientY);
  }, [updateSectionCursorAtPoint]);

  const clearSectionCursorPoint = useCallback(() => {
    lastSectionCursorPointRef.current = null;
  }, []);

  const cleanupSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
      sectionCursorFrameRef.current = 0;
    }
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
