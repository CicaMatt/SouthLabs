import { useCallback, useEffect, useRef } from 'react';
import {
  getCardGridEffectRgb,
  getCardGridOriginPage,
  getGridBurstPoint,
  getGridBurstTargetSections,
  getSectionBurstOpacityScale,
  getSectionBurstRgb,
  getSectionGridOriginPage,
  getSectionGridSize
} from './gridBurst';
import { createGridBurstCanvasController } from './gridBurstCanvas';
import { getTime } from '../../lib/dom';
import { clamp } from '../../lib/math';
import { distancePointToRect, getElementPageRect } from '../../lib/geometry';
import {
  CARD_GRID_ANCHOR_SELECTOR,
  GRID_BURST_DISABLED_SELECTOR,
  SOLUTION_CARD_SURFACE_SELECTOR
} from './domSelectors';

const SECTION_GRID_BURST_DELAY_INTERVAL_MS = 90;
const SECTION_GRID_BURST_TARGET_MARGIN = 120;
const CARD_BURST_PROXIMITY_RADIUS_PX = 180;
const CARD_BURST_INNER_ATTENUATION = 0.54;
const CARD_BURST_OUTER_MIN_ATTENUATION = 0.07;
const CARD_BURST_OUTER_MAX_ATTENUATION = 0.25;
const CARD_BURST_OUTER_MIN_PADDING = 24;
const CARD_BURST_OUTER_MAX_PADDING = 72;

function getElementBorderRadius(element) {
  const style = getComputedStyle(element);
  return (
    Number.parseFloat(style.borderTopLeftRadius || style.borderRadius) ||
    Number.parseFloat(style.borderRadius) ||
    0
  );
}

function getCardGridEffectZones(section, pageX, pageY, scrollX, scrollY, burstRadius) {
  return Array.from(section.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR))
    .map((card) => {
      const rgb = getCardGridEffectRgb(card);
      if (!rgb) return null;

      const rect = getElementPageRect(card, scrollX, scrollY);
      if (rect.width <= 0 || rect.height <= 0) return null;
      if (distancePointToRect(pageX, pageY, rect) > burstRadius) return null;

      return {
        card,
        rect,
        rgb,
        radius: getElementBorderRadius(card)
      };
    })
    .filter(Boolean);
}

function getCardBurstAttenuationZones(section, pageX, pageY, scrollX, scrollY, burstRadius) {
  return Array.from(section.querySelectorAll(SOLUTION_CARD_SURFACE_SELECTOR))
    .map((card) => {
      const rect = getElementPageRect(card, scrollX, scrollY);
      if (rect.width <= 0 || rect.height <= 0) return null;

      const distance = distancePointToRect(pageX, pageY, rect);
      if (distance > burstRadius + CARD_BURST_OUTER_MAX_PADDING) return null;

      const proximity = 1 - clamp(distance / CARD_BURST_PROXIMITY_RADIUS_PX, 0, 1);
      const hasCardGridEffect = Boolean(getCardGridEffectRgb(card));
      const radius = getElementBorderRadius(card);

      return {
        bottom: rect.bottom,
        innerAlpha: hasCardGridEffect ? 1 : CARD_BURST_INNER_ATTENUATION,
        left: rect.left,
        outerAlpha: hasCardGridEffect
          ? 0
          : CARD_BURST_OUTER_MIN_ATTENUATION +
            (CARD_BURST_OUTER_MAX_ATTENUATION - CARD_BURST_OUTER_MIN_ATTENUATION) * proximity,
        outerPadding: hasCardGridEffect
          ? 0
          : CARD_BURST_OUTER_MIN_PADDING +
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

      const burstPoint = getGridBurstPoint(mainElement, section, pressure);
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
      const startTime = windowObject.performance.now();

      targetSections.forEach((targetSection) => {
        const rgb = getSectionBurstRgb(targetSection);
        const intensity = burstPoint.opacityScale * getSectionBurstOpacityScale(targetSection);
        const gridSize = getSectionGridSize(targetSection);
        const origin = getSectionGridOriginPage(targetSection);
        const sectionRect = targetSection.getBoundingClientRect();
        const cardGridEffectZones = getCardGridEffectZones(
          targetSection,
          pageX,
          pageY,
          scrollX,
          scrollY,
          burstPoint.maxRadius
        );
        const cardAttenuationZones = getCardBurstAttenuationZones(
          targetSection,
          pageX,
          pageY,
          scrollX,
          scrollY,
          burstPoint.maxRadius
        );

        cardGridEffectZones.forEach((zone) => {
          const cardOrigin = getCardGridOriginPage(zone.card, origin);

          controller.addBurst({
            pageX,
            pageY,
            rgb: zone.rgb,
            maxRadius: burstPoint.maxRadius,
            intensity,
            gridSize,
            gridOriginX: cardOrigin.x,
            gridOriginY: cardOrigin.y,
            clipRect: {
              left: zone.rect.left,
              top: zone.rect.top,
              right: zone.rect.right,
              bottom: zone.rect.bottom,
              radius: zone.radius
            },
            startTime
          });
        });

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
          startTime
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
