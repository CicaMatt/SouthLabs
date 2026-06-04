import { useEffect, useRef } from 'react';
import { addMediaQueryChangeListener } from '../../lib/dom';
import {
  advanceParticle,
  computeForceState,
  computeFrameStep,
  createParticles,
  drawDot,
  getFrameInterval,
  isPointerActive,
  resizeCanvas,
  resizeParticles
} from './particleField';

const PARTICLE_EDGE_SAMPLE_SCALE = 0.8;
const PARTICLE_FPS_DOWNSHIFT_DELAY_MS = 3000;
const SVG_VIEWBOX = { width: 600, height: 540 };
const FACTORY_PARTICLE_EXCLUSION_SHAPES = [
  [
    [76, 500],
    [544, 500],
    [544, 520],
    [76, 520]
  ],
  [
    [126, 500],
    [126, 391],
    [380, 264],
    [494, 337],
    [494, 500]
  ],
  [
    [236, 336],
    [252, 210],
    [290, 210],
    [306, 301]
  ]
];

function createCanvasShape(shape, offsetX, offsetY, scaleX, scaleY) {
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };
  const points = shape.map(([x, y]) => {
    const point = [offsetX + x * scaleX, offsetY + y * scaleY];
    bounds.minX = Math.min(bounds.minX, point[0]);
    bounds.minY = Math.min(bounds.minY, point[1]);
    bounds.maxX = Math.max(bounds.maxX, point[0]);
    bounds.maxY = Math.max(bounds.maxY, point[1]);
    return point;
  });

  return { bounds, points };
}

function shapeContainsPoint({ bounds, points }, x, y) {
  if (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
    return false;
  }

  let isInside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) isInside = !isInside;
  }

  return isInside;
}

function createFactoryExclusion(canvas, factoryStage) {
  const svg = factoryStage?.querySelector('.v-svg');
  if (!svg) return null;

  const canvasRect = canvas.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  if (
    canvasRect.width <= 0 ||
    canvasRect.height <= 0 ||
    svgRect.width <= 0 ||
    svgRect.height <= 0
  ) {
    return null;
  }

  const offsetX = svgRect.left - canvasRect.left;
  const offsetY = svgRect.top - canvasRect.top;
  const scaleX = svgRect.width / SVG_VIEWBOX.width;
  const scaleY = svgRect.height / SVG_VIEWBOX.height;

  return FACTORY_PARTICLE_EXCLUSION_SHAPES.map((shape) =>
    createCanvasShape(shape, offsetX, offsetY, scaleX, scaleY)
  );
}

function isInsideFactoryExclusion(x, y, radius, exclusion) {
  if (!exclusion) return false;

  const sampleOffset = Math.max(1, radius * PARTICLE_EDGE_SAMPLE_SCALE);
  return exclusion.some(
    (shape) =>
      shapeContainsPoint(shape, x, y) ||
      shapeContainsPoint(shape, x + sampleOffset, y) ||
      shapeContainsPoint(shape, x - sampleOffset, y) ||
      shapeContainsPoint(shape, x, y + sampleOffset) ||
      shapeContainsPoint(shape, x, y - sampleOffset)
  );
}

export default function HeroParticleField({ factoryStageRef, pointerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const windowObject = canvas.ownerDocument.defaultView;
    if (!windowObject) return undefined;

    const reduceMotionQuery = windowObject.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = reduceMotionQuery.matches;
    let frameId = null;
    let frameTimeoutId = null;
    let lastFrameTime = 0;
    let lastPhysicsTime = 0;
    let activeFrameRateUntil = 0;
    let isVisible = true;
    let size = resizeCanvas(canvas, ctx);
    let particles = createParticles(size.width, size.height);
    let factoryExclusion = createFactoryExclusion(canvas, factoryStageRef?.current);

    const shouldUseActiveFrameRate = (now) => {
      if (isPointerActive(pointerRef.current, now)) {
        activeFrameRateUntil = now + PARTICLE_FPS_DOWNSHIFT_DELAY_MS;
        return true;
      }

      return now < activeFrameRateUntil;
    };

    const draw = (now, isStatic = false, step = 1) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const forceState = computeForceState(pointerRef.current, now, size.width, isStatic);

      for (const particle of particles) {
        if (!isStatic) {
          advanceParticle(particle, step, size, forceState);
        }
        if (isInsideFactoryExclusion(particle.x, particle.y, particle.radius, factoryExclusion)) {
          continue;
        }
        drawDot(ctx, particle.x, particle.y, particle.radius, particle.fillStyle);
      }
    };

    const queueAnimationFrame = () => {
      if (frameId !== null || reduceMotion || !isVisible) return;
      frameId = requestAnimationFrame(render);
    };

    const scheduleFrame = (delay = 0) => {
      if (frameId !== null || frameTimeoutId !== null || reduceMotion || !isVisible) return;

      if (delay > 0) {
        frameTimeoutId = windowObject.setTimeout(() => {
          frameTimeoutId = null;
          queueAnimationFrame();
        }, delay);
        return;
      }

      queueAnimationFrame();
    };

    function render(now) {
      frameId = null;

      const isActiveFrame = shouldUseActiveFrameRate(now);
      const frameInterval = getFrameInterval(size.width, isActiveFrame);
      const timeSinceLastFrame = lastFrameTime > 0 ? now - lastFrameTime : frameInterval;
      if (timeSinceLastFrame < frameInterval) {
        scheduleFrame(isActiveFrame ? 0 : frameInterval - timeSinceLastFrame);
        return;
      }

      const elapsed = lastPhysicsTime > 0 ? now - lastPhysicsTime : frameInterval;
      lastFrameTime = now;
      lastPhysicsTime = now;
      draw(now, false, computeFrameStep(elapsed));

      const nextFrameIsActive = shouldUseActiveFrameRate(now);
      scheduleFrame(nextFrameIsActive ? 0 : getFrameInterval(size.width, false));
    }

    const start = () => {
      if (frameId !== null || frameTimeoutId !== null || reduceMotion || !isVisible) return;
      lastFrameTime = 0;
      lastPhysicsTime = 0;
      scheduleFrame();
    };

    const stop = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (frameTimeoutId !== null) {
        windowObject.clearTimeout(frameTimeoutId);
        frameTimeoutId = null;
      }
    };

    const resizeField = () => {
      const nextSize = resizeCanvas(canvas, ctx);
      if (nextSize.width !== size.width || nextSize.height !== size.height) {
        particles = resizeParticles(particles, size, nextSize);
      }
      size = nextSize;
      factoryExclusion = createFactoryExclusion(canvas, factoryStageRef?.current);
      lastPhysicsTime = 0;
      draw(windowObject.performance.now(), reduceMotion);
    };

    const handleMotionChange = () => {
      reduceMotion = reduceMotionQuery.matches;
      if (reduceMotion) {
        stop();
        draw(windowObject.performance.now(), true);
      } else {
        start();
      }
    };

    const ResizeObserverConstructor = windowObject.ResizeObserver;
    const resizeObserver =
      typeof ResizeObserverConstructor === 'undefined'
        ? null
        : new ResizeObserverConstructor(resizeField);
    if (resizeObserver) {
      resizeObserver.observe(canvas);
      if (factoryStageRef?.current) {
        resizeObserver.observe(factoryStageRef.current);
      }
    } else {
      windowObject.addEventListener('resize', resizeField, { passive: true });
    }

    const IntersectionObserverConstructor = windowObject.IntersectionObserver;
    const visibilityObserver =
      typeof IntersectionObserverConstructor === 'undefined'
        ? null
        : new IntersectionObserverConstructor(([entry]) => {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            if (isVisible) {
              if (!wasVisible) {
                factoryExclusion = createFactoryExclusion(canvas, factoryStageRef?.current);
                draw(windowObject.performance.now(), reduceMotion);
              }
              start();
            } else {
              stop();
            }
          });
    visibilityObserver?.observe(canvas);

    const removeMotionChangeListener = addMediaQueryChangeListener(
      reduceMotionQuery,
      handleMotionChange
    );
    draw(windowObject.performance.now(), reduceMotion);
    start();

    return () => {
      stop();
      resizeObserver?.disconnect();
      if (!resizeObserver) {
        windowObject.removeEventListener('resize', resizeField);
      }
      visibilityObserver?.disconnect();
      removeMotionChangeListener();
    };
  }, [factoryStageRef, pointerRef]);

  return (
    <canvas aria-hidden="true" className="hero-particle-canvas absolute inset-0" ref={canvasRef} />
  );
}
