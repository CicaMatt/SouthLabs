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

const SECTION_CURSOR_THEMES = [
  {
    id: 'hero',
    color: '#9ce6fb',
    highlightOpacity: 0
  },
  {
    id: 'siti-web',
    color: '#1557d4'
  },
  {
    id: 'software-automazione',
    color: '#1f6fa8'
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
      const originX = elementRect.left + scrollX;
      const originY = baseTop + elementRect.top - rect.top;

      element.style.setProperty('--section-grid-origin-x', `${originX.toFixed(2)}px`);
      element.style.setProperty('--section-grid-origin-y', `${originY.toFixed(2)}px`);
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
  const sectionCursorFrameRef = useRef(0);
  const lastSectionCursorPointRef = useRef(null);
  const highlightedSectionsRef = useRef([]);
  const sectionCursorRef = useRef(null);
  const mainRef = useRef(null);

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

  const hideSectionCursor = useCallback(() => {
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }

    sectionCursorFrameRef.current = requestAnimationFrame(() => {
      highlightedSectionsRef.current.forEach((section) => {
        section.style.setProperty('--section-grid-highlight-opacity', '0');
      });
      highlightedSectionsRef.current = [];
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

      cursorElement.style.setProperty('--section-cursor-x', `${clientX}px`);
      cursorElement.style.setProperty('--section-cursor-y', `${clientY}px`);
      cursorElement.style.setProperty('--section-cursor-top-color', theme.topColor);
      cursorElement.style.setProperty('--section-cursor-bottom-color', theme.bottomColor);
      cursorElement.style.setProperty('--section-cursor-split', theme.split);
      cursorElement.style.setProperty('--section-cursor-opacity', '1');
    });
  }, [hideSectionCursor]);

  const handleMainPointerLeave = useCallback(() => {
    lastSectionCursorPointRef.current = null;
    resetGridOffset();
    hideSectionCursor();
  }, [hideSectionCursor, resetGridOffset]);

  const handleMainPointerMove = useCallback((event) => {
    if (event.pointerType === 'touch') return;

    const viewport = event.currentTarget.ownerDocument.defaultView;
    const width = viewport?.innerWidth || event.currentTarget.clientWidth || 1;
    const shiftX = (clamp(event.clientX / width, 0, 1) - 0.5) * 2;

    setGridOffset(shiftX * -GRID_MOTION_X, 0);
    lastSectionCursorPointRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      ownerDocument: event.currentTarget.ownerDocument
    };
    updateSectionCursorAtPoint(event.currentTarget.ownerDocument, event.clientX, event.clientY);
  }, [setGridOffset, updateSectionCursorAtPoint]);

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
  }, [updateSectionCursorAtPoint]);

  useEffect(() => () => {
    if (gridFrameRef.current) {
      cancelAnimationFrame(gridFrameRef.current);
    }
    if (sectionCursorFrameRef.current) {
      cancelAnimationFrame(sectionCursorFrameRef.current);
    }
  }, []);

  return (
    <div onContextMenuCapture={preventImageDefault} onDragStartCapture={preventImageDefault}>
      <TopNavBar />
      <main
        ref={mainRef}
        className="site-main-with-section-cursor"
        onPointerLeave={handleMainPointerLeave}
        onPointerMove={handleMainPointerMove}
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
