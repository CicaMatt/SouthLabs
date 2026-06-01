import { useCallback, useEffect, useRef } from 'react';
import {
  getGridBurstPoint,
  getGridBurstTargetSections,
  getSectionBurstOpacityScale,
  getSectionBurstRgb,
  getSectionGridOriginPage,
  getSectionGridSize
} from './gridBurst';
import { createGridBurstCanvasController } from './gridBurstCanvas';
import { getTime } from './inputDetection';
import { GRID_BURST_DISABLED_SELECTOR, SOLUTION_CARD_SURFACE_SELECTOR } from './selectors';

const SECTION_GRID_BURST_DELAY_INTERVAL_MS = 90;
const SECTION_GRID_BURST_TARGET_MARGIN = 120;
const CARD_BURST_PROXIMITY_RADIUS_PX = 180;
const CARD_BURST_INNER_ATTENUATION = 0.54;
const CARD_BURST_OUTER_MIN_ATTENUATION = 0.07;
const CARD_BURST_OUTER_MAX_ATTENUATION = 0.25;
const CARD_BURST_OUTER_MIN_PADDING = 24;
const CARD_BURST_OUTER_MAX_PADDING = 72;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getPointDistanceToRect(pageX, pageY, rect) {
  const dx = pageX < rect.left ? rect.left - pageX : Math.max(pageX - rect.right, 0);
  const dy = pageY < rect.top ? rect.top - pageY : Math.max(pageY - rect.bottom, 0);
  return Math.hypot(dx, dy);
}

function getElementPageRect(element, scrollX, scrollY) {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom + scrollY,
    height: rect.height,
    left: rect.left + scrollX,
    right: rect.right + scrollX,
    top: rect.top + scrollY,
    width: rect.width
  };
}

function getCardBurstAttenuationZones(section, pageX, pageY, scrollX, scrollY, burstRadius) {
  return Array.from(section.querySelectorAll(SOLUTION_CARD_SURFACE_SELECTOR))
    .map((card) => {
      const rect = getElementPageRect(card, scrollX, scrollY);
      if (rect.width <= 0 || rect.height <= 0) return null;

      const distance = getPointDistanceToRect(pageX, pageY, rect);
      if (distance > burstRadius + CARD_BURST_OUTER_MAX_PADDING) return null;

      const proximity = 1 - clamp(distance / CARD_BURST_PROXIMITY_RADIUS_PX, 0, 1);
      const style = getComputedStyle(card);
      const radius =
        Number.parseFloat(style.borderTopLeftRadius || style.borderRadius) ||
        Number.parseFloat(style.borderRadius) ||
        0;

      return {
        bottom: rect.bottom,
        innerAlpha: CARD_BURST_INNER_ATTENUATION,
        left: rect.left,
        outerAlpha:
          CARD_BURST_OUTER_MIN_ATTENUATION +
          (CARD_BURST_OUTER_MAX_ATTENUATION - CARD_BURST_OUTER_MIN_ATTENUATION) * proximity,
        outerPadding:
          CARD_BURST_OUTER_MIN_PADDING +
          (CARD_BURST_OUTER_MAX_PADDING - CARD_BURST_OUTER_MIN_PADDING) * proximity,
        radius,
        right: rect.right,
        top: rect.top
      };
    })
    .filter(Boolean);
}

export function useSectionGridBurst() {
  const burstCanvasRef = useRef(null);
  const burstControllerRef = useRef(null);
  const lastGridBurstAtRef = useRef(Number.NEGATIVE_INFINITY);

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

  const clearGridBursts = useCallback(() => {
    burstControllerRef.current?.clear();
  }, []);

  const triggerSectionGridBurstAtPoint = useCallback(
    ({ clientX, clientY, mainElement, pressure = 0.5, target }) => {
      if (target instanceof Element && target.closest(GRID_BURST_DISABLED_SELECTOR)) return;

      const section = target instanceof Element ? target.closest('section.section-grid-bg') : null;
      if (!section || section.id === 'hero' || !mainElement.contains(section)) return;

      const windowObject = mainElement.ownerDocument.defaultView;
      const controller = burstControllerRef.current;
      if (!windowObject || !controller) return;

      const now = getTime(windowObject);
      if (now - lastGridBurstAtRef.current < SECTION_GRID_BURST_DELAY_INTERVAL_MS) return;
      lastGridBurstAtRef.current = now;

      const burstPoint = getGridBurstPoint(mainElement, section, clientX, clientY, pressure);
      const burstOuterRadius = burstPoint.maxRadius + SECTION_GRID_BURST_TARGET_MARGIN;
      const targetSections = getGridBurstTargetSections(
        mainElement,
        clientX,
        clientY,
        burstOuterRadius
      );
      const scrollX = windowObject.scrollX || 0;
      const scrollY = windowObject.scrollY || 0;
      const pageX = clientX + scrollX;
      const pageY = clientY + scrollY;

      targetSections.forEach((targetSection) => {
        const rgb = getSectionBurstRgb(targetSection);
        const intensity = burstPoint.opacityScale * getSectionBurstOpacityScale(targetSection);
        const gridSize = getSectionGridSize(targetSection);
        const origin = getSectionGridOriginPage(targetSection);
        const sectionRect = targetSection.getBoundingClientRect();
        const cardAttenuationZones = getCardBurstAttenuationZones(
          targetSection,
          pageX,
          pageY,
          scrollX,
          scrollY,
          burstPoint.maxRadius
        );

        controller.addBurst({
          pageX,
          pageY,
          rgb,
          maxRadius: burstPoint.maxRadius,
          intensity,
          gridSize,
          gridOriginX: origin.x,
          gridOriginY: origin.y,
          cardAttenuationZones,
          clipRect: {
            left: sectionRect.left + scrollX,
            top: sectionRect.top + scrollY,
            right: sectionRect.right + scrollX,
            bottom: sectionRect.bottom + scrollY,
            radius: 0
          },
          startTime: windowObject.performance.now()
        });
      });
    },
    []
  );

  return {
    burstCanvasRef,
    clearGridBursts,
    triggerSectionGridBurstAtPoint
  };
}
