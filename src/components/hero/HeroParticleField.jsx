import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const TOUCH_NUDGE_MS = 720;
const POINTER_BURST_MS = 460;
const PARTICLE_DENSITY = 4400;
const POINTER_RADIUS = 148;
const POINTER_BURST_RADIUS_BOOST = 0.16;
const POINTER_FORCE = 0.49;
const POINTER_BURST_FORCE = 1.18;
const TOUCH_NUDGE_FORCE = 0.00205;
const MAX_PIXEL_RATIO = 1.25;
const MOBILE_FIELD_MAX_WIDTH = 700;
const MOBILE_PARTICLE_DENSITY = 3900;
const MOBILE_PARTICLE_MIN = 88;
const MOBILE_PARTICLE_MAX = 132;
const PARTICLE_MOTION_SPEED = 1.35;
const FIELD_PADDING = 32;
const BASE_FRAME_MS = 1000 / 60;
const FRAME_INTERVAL_MS = {
  active: 16,
  idleDesktop: 32,
  idleMobile: 48
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoothStep = (progress) => progress * progress * (3 - 2 * progress);

function addMediaQueryChangeListener(mediaQuery, listener) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }

  mediaQuery.addListener?.(listener);
  return () => mediaQuery.removeListener?.(listener);
}

function getParticleCount(width, height) {
  const coarseViewport = width < MOBILE_FIELD_MAX_WIDTH;
  if (coarseViewport) {
    return clamp(
      Math.round((width * height) / MOBILE_PARTICLE_DENSITY),
      MOBILE_PARTICLE_MIN,
      MOBILE_PARTICLE_MAX
    );
  }

  return clamp(Math.round((width * height) / PARTICLE_DENSITY), 125, 250);
}

function getFrameInterval(width, isActiveFrame) {
  if (isActiveFrame) return FRAME_INTERVAL_MS.active;
  return width < MOBILE_FIELD_MAX_WIDTH
    ? FRAME_INTERVAL_MS.idleMobile
    : FRAME_INTERVAL_MS.idleDesktop;
}

function shuffleIndexes(length) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function createParticle(x, y, width, options = {}) {
  const leftCompensation = x < width * 0.36 ? (options.leftCompensation ?? 0.08) : 0;
  const alpha = clamp(
    (options.alphaBase ?? 0.34)
      + leftCompensation
      + (options.alphaBoost ?? 0)
      + Math.random() * (options.alphaRange ?? 0.42),
    0.12,
    0.88
  );
  const color = Math.random() > (options.cyanChance ?? 0.28) ? '214, 250, 255' : '71, 214, 255';
  const driftAngle = Math.random() * TAU;
  const driftSpeed = (
    (options.driftSpeedMin ?? 0.018)
    + Math.random() * (options.driftSpeedRange ?? 0.038)
  ) * PARTICLE_MOTION_SPEED;

  return {
    x,
    y,
    anchorX: x,
    anchorY: y,
    vx: (Math.random() - 0.5) * (options.initialVelocity ?? 0.16),
    vy: (Math.random() - 0.5) * (options.initialVelocity ?? 0.16),
    radius: (options.radiusMin ?? 0.95) + Math.random() * (options.radiusRange ?? 1.35),
    driftX: Math.cos(driftAngle) * driftSpeed,
    driftY: Math.sin(driftAngle) * driftSpeed * 0.72,
    phase: Math.random() * TAU,
    phaseSpeed: (
      (options.phaseSpeedMin ?? 0.004)
      + Math.random() * (options.phaseSpeedRange ?? 0.009)
    ) * PARTICLE_MOTION_SPEED,
    flow: (
      (options.flowMin ?? 0.012)
      + Math.random() * (options.flowRange ?? 0.022)
    ) * PARTICLE_MOTION_SPEED,
    spring: (options.springMin ?? 0.0055) + Math.random() * (options.springRange ?? 0.006),
    drag: (options.dragMin ?? 0.885) + Math.random() * (options.dragRange ?? 0.055),
    mass: (options.massMin ?? 0.82) + Math.random() * (options.massRange ?? 0.54),
    maxSpeed: (options.maxSpeedMin ?? 1.72) + Math.random() * (options.maxSpeedRange ?? 1.34),
    fillStyle: `rgba(${color}, ${alpha})`
  };
}

function createMobileParticles(width, height, count) {
  const columns = Math.max(4, Math.ceil(Math.sqrt(count * (width / height))));
  const rows = Math.max(8, Math.ceil(count / columns));
  const cells = shuffleIndexes(columns * rows);
  const insetX = width * 0.04;
  const insetY = height * 0.04;
  const fieldWidth = width - insetX * 2;
  const fieldHeight = height - insetY * 2;

  return cells.slice(0, count).map((cellIndex) => {
    const column = cellIndex % columns;
    const row = Math.floor(cellIndex / columns);
    const x = insetX + ((column + 0.18 + Math.random() * 0.64) / columns) * fieldWidth;
    const y = insetY + ((row + 0.18 + Math.random() * 0.64) / rows) * fieldHeight;
    return createParticle(x, y, width, {
      alphaBase: 0.32,
      alphaRange: 0.36,
      cyanChance: 0.25,
      leftCompensation: 0.06,
      radiusMin: 0.88,
      radiusRange: 1.16,
      driftSpeedMin: 0.012,
      driftSpeedRange: 0.026,
      flowMin: 0.010,
      flowRange: 0.018,
      maxSpeedMin: 1.24,
      maxSpeedRange: 0.94,
      initialVelocity: 0.10
    });
  });
}

function createParticles(width, height) {
  const count = getParticleCount(width, height);
  if (width < MOBILE_FIELD_MAX_WIDTH) return createMobileParticles(width, height, count);

  const columns = Math.max(1, Math.ceil(Math.sqrt(count * (width / height))));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cells = shuffleIndexes(columns * rows);

  const particles = cells.slice(0, count).map((cellIndex) => {
    const column = cellIndex % columns;
    const row = Math.floor(cellIndex / columns);
    const x = ((column + 0.18 + Math.random() * 0.64) / columns) * width;
    const y = ((row + 0.18 + Math.random() * 0.64) / rows) * height;
    return createParticle(x, y, width);
  });

  return particles;
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const windowObject = canvas.ownerDocument.defaultView;
  const pixelRatio = Math.min(windowObject?.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const canvasWidth = Math.round(width * pixelRatio);
  const canvasHeight = Math.round(height * pixelRatio);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  return { width, height };
}

function resizeParticles(particles, previousSize, nextSize) {
  if (!previousSize || previousSize.width <= 0 || previousSize.height <= 0) {
    return createParticles(nextSize.width, nextSize.height);
  }

  const scaleX = nextSize.width / previousSize.width;
  const scaleY = nextSize.height / previousSize.height;
  const nextParticles = particles.map((particle) => ({
    ...particle,
    x: particle.x * scaleX,
    y: particle.y * scaleY,
    anchorX: particle.anchorX * scaleX,
    anchorY: particle.anchorY * scaleY
  }));
  const targetCount = getParticleCount(nextSize.width, nextSize.height);

  if (nextParticles.length > targetCount) {
    nextParticles.length = targetCount;
  }

  while (nextParticles.length < targetCount) {
    nextParticles.push(createParticle(
      Math.random() * nextSize.width,
      Math.random() * nextSize.height,
      nextSize.width
    ));
  }

  return nextParticles;
}

function drawDot(ctx, x, y, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function wrapParticle(particle, width, height) {
  if (particle.anchorX < -FIELD_PADDING) {
    particle.anchorX = width + FIELD_PADDING;
    particle.x = particle.anchorX;
    particle.vx = 0;
  } else if (particle.anchorX > width + FIELD_PADDING) {
    particle.anchorX = -FIELD_PADDING;
    particle.x = particle.anchorX;
    particle.vx = 0;
  }

  if (particle.anchorY < -FIELD_PADDING) {
    particle.anchorY = height + FIELD_PADDING;
    particle.y = particle.anchorY;
    particle.vy = 0;
  } else if (particle.anchorY > height + FIELD_PADDING) {
    particle.anchorY = -FIELD_PADDING;
    particle.y = particle.anchorY;
    particle.vy = 0;
  }
}

function advanceParticle(particle, step, size, forceState) {
  particle.phase += particle.phaseSpeed * step;

  const flowX = Math.cos(particle.phase + particle.anchorY * 0.007) * particle.flow;
  const flowY = Math.sin(particle.phase * 0.86 + particle.anchorX * 0.005) * particle.flow * 0.78;
  particle.anchorX += (particle.driftX + flowX) * step;
  particle.anchorY += (particle.driftY + flowY) * step;
  wrapParticle(particle, size.width, size.height);

  let ax = (particle.anchorX - particle.x) * particle.spring;
  let ay = (particle.anchorY - particle.y) * particle.spring;

  if (forceState.touchEase > 0) {
    ax += forceState.touchOffsetX * TOUCH_NUDGE_FORCE * forceState.touchEase / particle.mass;
    ay += forceState.touchOffsetY * TOUCH_NUDGE_FORCE * forceState.touchEase / particle.mass;
  }

  if (forceState.hasPointer) {
    const dx = particle.x - forceState.repelX;
    const dy = particle.y - forceState.repelY;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq > 0.1 && distanceSq < forceState.repelRadiusSq) {
      const distance = Math.sqrt(distanceSq);
      const proximity = 1 - distance / forceState.repelRadius;
      const force = smoothStep(proximity) * forceState.repelForce / particle.mass;
      ax += (dx / distance) * force;
      ay += (dy / distance) * force;
    }
  }

  const dragFactor = Math.pow(particle.drag, step);
  particle.vx = (particle.vx + ax * step) * dragFactor;
  particle.vy = (particle.vy + ay * step) * dragFactor;

  const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
  if (speed > particle.maxSpeed) {
    const limit = particle.maxSpeed / speed;
    particle.vx *= limit;
    particle.vy *= limit;
  }

  particle.x += particle.vx * step;
  particle.y += particle.vy * step;
}

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

      const pointer = pointerRef.current;
      const isRepelling = Boolean(pointer.active || pointer.repelActive);
      const burstDuration = Math.max(1, (pointer.burstUntil || 0) - (pointer.burstStart || 0));
      const burstProgress = !isStatic && now < (pointer.burstUntil || 0)
        ? clamp((now - pointer.burstStart) / burstDuration, 0, 1)
        : 0;
      const burstEase = Math.sin(burstProgress * Math.PI);
      const repelX = isRepelling ? pointer.x : pointer.burstX;
      const repelY = isRepelling ? pointer.y : pointer.burstY;
      const hasPointer = !isStatic && (isRepelling || burstEase > 0) && repelX >= 0 && repelY >= 0;
      const touchDuration = Math.max(1, (pointer.touchNudgeUntil || 0) - (pointer.touchNudgeStart || 0));
      const touchProgress = !isStatic && now < (pointer.touchNudgeUntil || 0)
        ? clamp((now - pointer.touchNudgeStart) / touchDuration, 0, 1)
        : 0;
      const touchEase = Math.sin(touchProgress * Math.PI);
      const touchOffsetX = touchEase * pointer.touchNudgeX;
      const touchOffsetY = touchEase * pointer.touchNudgeY;
      const repelRadius = POINTER_RADIUS
        * (size.width < MOBILE_FIELD_MAX_WIDTH ? 0.76 : 1)
        * (1 + burstEase * POINTER_BURST_RADIUS_BOOST);
      const forceState = {
        hasPointer,
        repelX,
        repelY,
        repelRadius,
        repelRadiusSq: repelRadius * repelRadius,
        repelForce: (isRepelling ? POINTER_FORCE : POINTER_FORCE * 0.42) + burstEase * POINTER_BURST_FORCE,
        touchEase,
        touchOffsetX,
        touchOffsetY
      };

      for (const particle of particles) {
        if (!isStatic) {
          advanceParticle(particle, step, size, forceState);
        }

        drawDot(ctx, particle.x, particle.y, particle.radius, particle.fillStyle);
      }
    };

    const render = (now) => {
      frameId = requestAnimationFrame(render);

      const pointer = pointerRef.current;
      const isRepelling = Boolean(pointer.active || pointer.repelActive);
      const isTouchNudging = now < (pointer.touchNudgeUntil || 0);
      const isBursting = now < (pointer.burstUntil || 0);
      const frameInterval = getFrameInterval(size.width, isRepelling || isTouchNudging || isBursting);
      if (now - lastFrameTime < frameInterval) return;

      const elapsed = lastPhysicsTime > 0 ? now - lastPhysicsTime : frameInterval;
      const step = clamp(elapsed / BASE_FRAME_MS, 0.4, 2.8);
      lastFrameTime = now;
      lastPhysicsTime = now;
      draw(now, false, step);
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
