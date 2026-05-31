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
import { GRID_BURST_DISABLED_SELECTOR } from './selectors';

const SECTION_GRID_BURST_DELAY_INTERVAL_MS = 90;
const SECTION_GRID_BURST_TARGET_MARGIN = 120;

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

        controller.addBurst({
          pageX,
          pageY,
          rgb,
          maxRadius: burstPoint.maxRadius,
          intensity,
          gridSize,
          gridOriginX: origin.x,
          gridOriginY: origin.y,
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
