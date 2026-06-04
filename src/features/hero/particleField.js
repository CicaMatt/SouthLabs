import { TAU, clamp, smoothStep } from '../../lib/math';

const PARTICLE_DENSITY = 5000;
const POINTER_RADIUS = 164;
const POINTER_BURST_RADIUS_BOOST = 0.16;
const POINTER_FORCE = 0.68;
const POINTER_BURST_FORCE = 1.32;
const TOUCH_NUDGE_FORCE = 0.00205;
const MAX_PIXEL_RATIO = 1.1;
const MOBILE_FIELD_MAX_WIDTH = 700;
const MOBILE_PARTICLE_DENSITY = 4400;
const MOBILE_PARTICLE_MIN = 80;
const MOBILE_PARTICLE_MAX = 118;
const IDLE_MOTION_SPEED = 0.32;
const DESKTOP_IDLE_ANCHOR_RADIUS = 12;
const MOBILE_IDLE_ANCHOR_RADIUS = 9;
const IDLE_ANCHOR_FOLLOW = 0.11;
const FRAME_INTERVAL_MS = {
  active: 16,
  idleDesktop: 40,
  idleMobile: 40
};

const BASE_FRAME_MS = 1000 / 60;

function getParticleCount(width, height) {
  if (width < MOBILE_FIELD_MAX_WIDTH) {
    return clamp(
      Math.round((width * height) / MOBILE_PARTICLE_DENSITY),
      MOBILE_PARTICLE_MIN,
      MOBILE_PARTICLE_MAX
    );
  }

  return clamp(Math.round((width * height) / PARTICLE_DENSITY), 112, 220);
}

export function getFrameInterval(width, isActiveFrame) {
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
    (options.alphaBase ?? 0.34) +
      leftCompensation +
      (options.alphaBoost ?? 0) +
      Math.random() * (options.alphaRange ?? 0.42),
    0.12,
    0.88
  );
  const color = Math.random() > (options.cyanChance ?? 0.28) ? '214, 250, 255' : '71, 214, 255';
  const idleRadius = (options.idleRadiusMin ?? 5) + Math.random() * (options.idleRadiusRange ?? 6);
  const idlePhase = Math.random() * TAU;
  const maxSpeed = (options.maxSpeedMin ?? 1.72) + Math.random() * (options.maxSpeedRange ?? 1.34);

  return {
    x,
    y,
    originX: x,
    originY: y,
    anchorX: x,
    anchorY: y,
    vx: (Math.random() - 0.5) * (options.initialVelocity ?? 0.16),
    vy: (Math.random() - 0.5) * (options.initialVelocity ?? 0.16),
    radius: (options.radiusMin ?? 0.95) + Math.random() * (options.radiusRange ?? 1.35),
    idleRadius,
    idleOrbitX: Math.cos(idlePhase),
    idleOrbitY: Math.sin(idlePhase),
    phaseSpeed:
      ((options.phaseSpeedMin ?? 0.004) + Math.random() * (options.phaseSpeedRange ?? 0.009)) *
      IDLE_MOTION_SPEED,
    spring: (options.springMin ?? 0.0055) + Math.random() * (options.springRange ?? 0.006),
    drag: (options.dragMin ?? 0.885) + Math.random() * (options.dragRange ?? 0.055),
    mass: (options.massMin ?? 0.82) + Math.random() * (options.massRange ?? 0.54),
    maxSpeed,
    maxSpeedSq: maxSpeed * maxSpeed,
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
      idleRadiusMin: 4,
      idleRadiusRange: 5,
      maxSpeedMin: 1.24,
      maxSpeedRange: 0.94,
      initialVelocity: 0.1
    });
  });
}

export function createParticles(width, height) {
  const count = getParticleCount(width, height);
  if (width < MOBILE_FIELD_MAX_WIDTH) return createMobileParticles(width, height, count);

  const columns = Math.max(1, Math.ceil(Math.sqrt(count * (width / height))));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cells = shuffleIndexes(columns * rows);

  return cells.slice(0, count).map((cellIndex) => {
    const column = cellIndex % columns;
    const row = Math.floor(cellIndex / columns);
    const x = ((column + 0.18 + Math.random() * 0.64) / columns) * width;
    const y = ((row + 0.18 + Math.random() * 0.64) / rows) * height;
    return createParticle(x, y, width);
  });
}

export function resizeCanvas(canvas, ctx) {
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

export function resizeParticles(particles, previousSize, nextSize) {
  if (!previousSize || previousSize.width <= 0 || previousSize.height <= 0) {
    return createParticles(nextSize.width, nextSize.height);
  }

  const scaleX = nextSize.width / previousSize.width;
  const scaleY = nextSize.height / previousSize.height;
  const nextParticles = particles.map((particle) => ({
    ...particle,
    x: particle.x * scaleX,
    y: particle.y * scaleY,
    originX: (particle.originX ?? particle.anchorX) * scaleX,
    originY: (particle.originY ?? particle.anchorY) * scaleY,
    anchorX: particle.anchorX * scaleX,
    anchorY: particle.anchorY * scaleY
  }));
  const targetCount = getParticleCount(nextSize.width, nextSize.height);

  if (nextParticles.length > targetCount) {
    nextParticles.length = targetCount;
  }
  while (nextParticles.length < targetCount) {
    nextParticles.push(
      createParticle(
        Math.random() * nextSize.width,
        Math.random() * nextSize.height,
        nextSize.width
      )
    );
  }

  return nextParticles;
}

export function drawDot(ctx, x, y, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function updateIdleAnchor(particle, width, step) {
  const originX = particle.originX ?? particle.anchorX;
  const originY = particle.originY ?? particle.anchorY;
  const maxOffset =
    width < MOBILE_FIELD_MAX_WIDTH ? MOBILE_IDLE_ANCHOR_RADIUS : DESKTOP_IDLE_ANCHOR_RADIUS;
  const idleRadius = Math.min(particle.idleRadius ?? maxOffset * 0.7, maxOffset * 0.92);
  const orbitX = particle.idleOrbitX ?? 1;
  const orbitY = particle.idleOrbitY ?? 0;
  const rotation = (particle.phaseSpeed ?? 0) * step;
  const nextOrbitX = orbitX - orbitY * rotation;
  const nextOrbitY = orbitY + orbitX * rotation;
  const orbitLengthSq = nextOrbitX * nextOrbitX + nextOrbitY * nextOrbitY;
  const orbitCorrection = 1.5 - 0.5 * orbitLengthSq;
  particle.idleOrbitX = nextOrbitX * orbitCorrection;
  particle.idleOrbitY = nextOrbitY * orbitCorrection;

  const targetX = originX + particle.idleOrbitX * idleRadius;
  const targetY = originY + particle.idleOrbitY * idleRadius;
  const follow = Math.min(1, IDLE_ANCHOR_FOLLOW * step);

  particle.anchorX += (targetX - particle.anchorX) * follow;
  particle.anchorY += (targetY - particle.anchorY) * follow;

  const dx = particle.anchorX - originX;
  const dy = particle.anchorY - originY;
  const distanceSq = dx * dx + dy * dy;
  const maxOffsetSq = maxOffset * maxOffset;

  if (distanceSq > maxOffsetSq) {
    const scale = maxOffsetSq / distanceSq;
    particle.anchorX = originX + dx * scale;
    particle.anchorY = originY + dy * scale;
  }
}

export function advanceParticle(particle, step, size, forceState) {
  updateIdleAnchor(particle, size.width, step);

  let ax = (particle.anchorX - particle.x) * particle.spring;
  let ay = (particle.anchorY - particle.y) * particle.spring;

  if (forceState.touchEase > 0) {
    ax += (forceState.touchOffsetX * TOUCH_NUDGE_FORCE * forceState.touchEase) / particle.mass;
    ay += (forceState.touchOffsetY * TOUCH_NUDGE_FORCE * forceState.touchEase) / particle.mass;
  }

  if (forceState.hasPointer) {
    const dx = particle.x - forceState.repelX;
    const dy = particle.y - forceState.repelY;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq > 0.1 && distanceSq < forceState.repelRadiusSq) {
      const distance = Math.sqrt(distanceSq);
      const proximity = 1 - distance / forceState.repelRadius;
      const force = (smoothStep(proximity) * forceState.repelForce) / particle.mass;
      ax += (dx / distance) * force;
      ay += (dy / distance) * force;
    }
  }

  const dragFactor = Math.pow(particle.drag, step);
  particle.vx = (particle.vx + ax * step) * dragFactor;
  particle.vy = (particle.vy + ay * step) * dragFactor;

  if (forceState.hasPointer || forceState.touchEase > 0) {
    const maxSpeedSq = particle.maxSpeedSq ?? particle.maxSpeed * particle.maxSpeed;
    const speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
    if (speedSq > maxSpeedSq) {
      const limit = particle.maxSpeed / Math.sqrt(speedSq);
      particle.vx *= limit;
      particle.vy *= limit;
    }
  }

  particle.x += particle.vx * step;
  particle.y += particle.vy * step;
}

export function computeForceState(pointer, now, fieldWidth, isStatic) {
  const isRepelling = Boolean(pointer.active || pointer.repelActive);
  const burstDuration = Math.max(1, (pointer.burstUntil || 0) - (pointer.burstStart || 0));
  const burstProgress =
    !isStatic && now < (pointer.burstUntil || 0)
      ? clamp((now - pointer.burstStart) / burstDuration, 0, 1)
      : 0;
  const burstEase = Math.sin(burstProgress * Math.PI);
  const repelX = isRepelling ? pointer.x : pointer.burstX;
  const repelY = isRepelling ? pointer.y : pointer.burstY;
  const hasPointer = !isStatic && (isRepelling || burstEase > 0) && repelX >= 0 && repelY >= 0;
  const touchDuration = Math.max(
    1,
    (pointer.touchNudgeUntil || 0) - (pointer.touchNudgeStart || 0)
  );
  const touchProgress =
    !isStatic && now < (pointer.touchNudgeUntil || 0)
      ? clamp((now - pointer.touchNudgeStart) / touchDuration, 0, 1)
      : 0;
  const touchEase = Math.sin(touchProgress * Math.PI);
  const repelRadius =
    POINTER_RADIUS *
    (fieldWidth < MOBILE_FIELD_MAX_WIDTH ? 0.76 : 1) *
    (1 + burstEase * POINTER_BURST_RADIUS_BOOST);

  return {
    hasPointer,
    repelX,
    repelY,
    repelRadius,
    repelRadiusSq: repelRadius * repelRadius,
    repelForce:
      (isRepelling ? POINTER_FORCE : POINTER_FORCE * 0.42) + burstEase * POINTER_BURST_FORCE,
    touchEase,
    touchOffsetX: touchEase * pointer.touchNudgeX,
    touchOffsetY: touchEase * pointer.touchNudgeY
  };
}

export function computeFrameStep(elapsed) {
  return clamp(elapsed / BASE_FRAME_MS, 0.4, 2.8);
}

export function isPointerActive(pointer, now) {
  const isRepelling = Boolean(pointer.active || pointer.repelActive);
  const isTouchNudging = now < (pointer.touchNudgeUntil || 0);
  const isBursting = now < (pointer.burstUntil || 0);
  return isRepelling || isTouchNudging || isBursting;
}
