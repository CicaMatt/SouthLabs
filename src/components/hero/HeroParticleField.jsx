import { useEffect, useRef } from 'react';
import {
  addMediaQueryChangeListener,
  advanceParticle,
  computeForceState,
  computeFrameStep,
  createParticles,
  drawDot,
  getFrameInterval,
  isPointerActive,
  resizeCanvas,
  resizeParticles
} from './heroParticleSim';

export default function HeroParticleField({ pointerRef }) {
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
    let isVisible = true;
    let size = resizeCanvas(canvas, ctx);
    let particles = createParticles(size.width, size.height);

    const draw = (now, isStatic = false, step = 1) => {
      ctx.clearRect(0, 0, size.width, size.height);
      const forceState = computeForceState(pointerRef.current, now, size.width, isStatic);

      for (const particle of particles) {
        if (!isStatic) {
          advanceParticle(particle, step, size, forceState);
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

      const isActiveFrame = isPointerActive(pointerRef.current, now);
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

      const nextFrameIsActive = isPointerActive(pointerRef.current, now);
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
  }, [pointerRef]);

  return (
    <canvas aria-hidden="true" className="hero-particle-canvas absolute inset-0" ref={canvasRef} />
  );
}
