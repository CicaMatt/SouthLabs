import { useCallback, useRef } from 'react';
import { buildSectionCursorLayout, getSectionCursorTheme } from './cursorTheme';
import { clearCardGridHighlight, updateCardGridHighlight } from './gridSurface';
import { updateHeroGraphicCursorState } from './heroGraphicHitTest';

export function useSectionCursor() {
  const sectionCursorFrameRef = useRef(0);
  const sectionCursorFrameKindRef = useRef(null);
  const lastSectionCursorPointRef = useRef(null);
  const highlightedSectionsRef = useRef([]);
  const highlightedCardGridAnchorsRef = useRef([]);
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

    const { clientX, clientY, mainElement } = latestPoint;

    updateHeroGraphicCursorState(mainElement, clientX, clientY);

    const windowObject = mainElement.ownerDocument.defaultView;
    const pageX = clientX + (windowObject?.scrollX || 0);
    const pageY = clientY + (windowObject?.scrollY || 0);
    const dotSize = cursorElement.getBoundingClientRect().width || 20;
    const layout = getSectionCursorLayout(mainElement);
    const theme = getSectionCursorTheme(layout, pageX, pageY, dotSize);
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

    theme.highlights.forEach(({ section, color, opacity, rect }) => {
      section.style.setProperty(
        '--section-grid-highlight-x',
        `${(pageX - rect.left).toFixed(2)}px`
      );
      section.style.setProperty('--section-grid-highlight-y', `${(pageY - rect.top).toFixed(2)}px`);
      section.style.setProperty('--section-grid-highlight-color', color);
      section.style.setProperty('--section-grid-highlight-opacity', opacity.toFixed(3));
    });
    highlightedSectionsRef.current = nextHighlightedSections;

    const nextHighlightedCardGridAnchors = new Set();
    theme.highlights.forEach(({ cardAnchors, color, opacity }) => {
      cardAnchors.forEach(({ element: card, rect }) => {
        updateCardGridHighlight(card, pageX, pageY, color, opacity, rect);
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
