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

    const render = (now) => {
      frameId = requestAnimationFrame(render);

      const frameInterval = getFrameInterval(size.width, isPointerActive(pointerRef.current, now));
      if (now - lastFrameTime < frameInterval) return;

      const elapsed = lastPhysicsTime > 0 ? now - lastPhysicsTime : frameInterval;
      lastFrameTime = now;
      lastPhysicsTime = now;
      draw(now, false, computeFrameStep(elapsed));
    };

    const start = () => {
      if (frameId !== null || reduceMotion || !isVisible) return;
      lastFrameTime = 0;
      lastPhysicsTime = 0;
      frameId = requestAnimationFrame(render);
    };

    const stop = () => {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      frameId = null;
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
    const resizeObserver = typeof ResizeObserverConstructor === 'undefined'
      ? null
      : new ResizeObserverConstructor(resizeField);
    if (resizeObserver) {
      resizeObserver.observe(canvas);
    } else {
      windowObject.addEventListener('resize', resizeField, { passive: true });
    }

    const IntersectionObserverConstructor = windowObject.IntersectionObserver;
    const visibilityObserver = typeof IntersectionObserverConstructor === 'undefined'
      ? null
      : new IntersectionObserverConstructor(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      });
    visibilityObserver?.observe(canvas);

    const removeMotionChangeListener = addMediaQueryChangeListener(reduceMotionQuery, handleMotionChange);
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

  return <canvas aria-hidden="true" className="hero-particle-canvas absolute inset-0" ref={canvasRef} />;
}
