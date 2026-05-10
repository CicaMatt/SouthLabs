import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const TOUCH_NUDGE_MS = 720;
const POINTER_BURST_MS = 420;
const PARTICLE_DENSITY = 4400;
const POINTER_RADIUS = 170;
const POINTER_FORCE = 92;
const MAX_PIXEL_RATIO = 1.25;
const MOBILE_FIELD_MAX_WIDTH = 700;
const FRAME_INTERVAL_MS = {
  active: 18,
  idleDesktop: 48,
  idleMobile: 64
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getParticleCount(width, height) {
  const coarseViewport = width < MOBILE_FIELD_MAX_WIDTH;
  const min = coarseViewport ? 64 : 125;
  const max = coarseViewport ? 112 : 250;
  return clamp(Math.round((width * height) / PARTICLE_DENSITY), min, max);
}

function getFrameInterval(width, isActiveFrame) {
  if (isActiveFrame) return FRAME_INTERVAL_MS.active;
  return width < MOBILE_FIELD_MAX_WIDTH
    ? FRAME_INTERVAL_MS.idleMobile
    : FRAME_INTERVAL_MS.idleDesktop;
}

function createParticles(width, height) {
  const count = getParticleCount(width, height);
  const columns = Math.max(1, Math.ceil(Math.sqrt(count * (width / height))));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cells = Array.from({ length: columns * rows }, (_, index) => index);

  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return cells.slice(0, count).map((cellIndex) => {
    const column = cellIndex % columns;
    const row = Math.floor(cellIndex / columns);
    const x = ((column + 0.18 + Math.random() * 0.64) / columns) * width;
    const y = ((row + 0.18 + Math.random() * 0.64) / rows) * height;
    const leftCompensation = x < width * 0.36 ? 0.08 : 0;
    const alpha = 0.34 + leftCompensation + Math.random() * 0.42;
    const color = Math.random() > 0.28 ? '214, 250, 255' : '71, 214, 255';

    return {
      x,
      y,
      radius: 0.95 + Math.random() * 1.35,
      driftX: (Math.random() - 0.5) * 0.18,
      driftY: (Math.random() - 0.5) * 0.14,
      phase: Math.random() * TAU,
      phaseSpeed: 0.008 + Math.random() * 0.014,
      wander: 1.4 + Math.random() * 2.8,
      fillStyle: `rgba(${color}, ${alpha})`
    };
  });
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { width, height };
}

function drawDot(ctx, x, y, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

export default function HeroParticleField({ pointerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return undefined;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = reduceMotionQuery.matches;
    let frameId = null;
    let lastFrameTime = 0;
    let isVisible = true;
    let size = resizeCanvas(canvas, ctx);
    let particles = createParticles(size.width, size.height);

    const draw = (now, isStatic = false) => {
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
      const repelRadius = POINTER_RADIUS * (size.width < MOBILE_FIELD_MAX_WIDTH ? 0.76 : 1) * (1 + burstEase * 0.34);
      const repelRadiusSq = repelRadius * repelRadius;
      const repelForce = POINTER_FORCE * (1 + burstEase * 1.35);

      for (const particle of particles) {
        if (!isStatic) {
          particle.x += particle.driftX;
          particle.y += particle.driftY;
          particle.phase += particle.phaseSpeed;

          if (particle.x < -12) particle.x = size.width + 12;
          if (particle.x > size.width + 12) particle.x = -12;
          if (particle.y < -12) particle.y = size.height + 12;
          if (particle.y > size.height + 12) particle.y = -12;
        }

        let x = particle.x + Math.cos(particle.phase) * particle.wander + touchOffsetX;
        let y = particle.y + Math.sin(particle.phase) * particle.wander + touchOffsetY;

        if (hasPointer) {
          const dx = x - repelX;
          const dy = y - repelY;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq > 0.1 && distanceSq < repelRadiusSq) {
            const distance = Math.sqrt(distanceSq);
            const force = ((1 - distance / repelRadius) ** 2) * repelForce;
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }

        drawDot(ctx, x, y, particle.radius, particle.fillStyle);
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

      lastFrameTime = now;
      draw(now);
    };

    const start = () => {
      if (frameId !== null || reduceMotion || !isVisible) return;
      lastFrameTime = 0;
      frameId = requestAnimationFrame(render);
    };

    const stop = () => {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    const resetField = () => {
      size = resizeCanvas(canvas, ctx);
      particles = createParticles(size.width, size.height);
      draw(performance.now(), reduceMotion);
    };

    const handleMotionChange = () => {
      reduceMotion = reduceMotionQuery.matches;
      if (reduceMotion) {
        stop();
        draw(performance.now(), true);
      } else {
        start();
      }
    };

    const resizeObserver = new ResizeObserver(resetField);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    reduceMotionQuery.addEventListener('change', handleMotionChange);
    draw(performance.now(), reduceMotion);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reduceMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [pointerRef]);

  return <canvas aria-hidden="true" className="hero-particle-canvas absolute inset-0" ref={canvasRef} />;
}

export { POINTER_BURST_MS };
