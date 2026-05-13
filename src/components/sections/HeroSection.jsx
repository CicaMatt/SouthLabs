import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FactoryIllustration from '../hero/FactoryIllustration';
import HeroParticleField from '../hero/HeroParticleField';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const POINTER_BURST_MS = 460;
const TOUCH_PARTICLE_NUDGE_MS = 720;
const FACTORY_ACCELERATION_RATE = 2.25;
const FACTORY_ACCELERATION_RAMP_UP_MS = 220;
const FACTORY_ACCELERATION_HOLD_MS = 150;
const FACTORY_ACCELERATION_RAMP_DOWN_MS = 760;
const FACTORY_ACCELERATION_TOTAL_MS = (
  FACTORY_ACCELERATION_RAMP_UP_MS
  + FACTORY_ACCELERATION_HOLD_MS
  + FACTORY_ACCELERATION_RAMP_DOWN_MS
);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (start, end, progress) => start + (end - start) * progress;
const smoothStep = (progress) => progress * progress * (3 - 2 * progress);

const createPointerState = (overrides = {}) => ({
  ...DEFAULT_POINTER,
  x: -1,
  y: -1,
  active: false,
  repelActive: false,
  burstStart: 0,
  burstUntil: 0,
  burstX: -1,
  burstY: -1,
  touchNudgeStart: 0,
  touchNudgeUntil: 0,
  touchNudgeX: 0,
  touchNudgeY: 0,
  ...overrides
});

function getPointerState(e) {
  const b = e.currentTarget.getBoundingClientRect();
  const rx = clamp((e.clientX - b.left) / b.width, 0, 1);
  const ry = clamp((e.clientY - b.top) / b.height, 0, 1);

  return {
    x: Number((e.clientX - b.left).toFixed(2)),
    y: Number((e.clientY - b.top).toFixed(2)),
    pctX: Number((rx * 100).toFixed(2)),
    pctY: Number((ry * 100).toFixed(2)),
    shiftX: Number(((rx - 0.5) * 2).toFixed(4)),
    shiftY: Number(((ry - 0.5) * 2).toFixed(4))
  };
}

function getAnimationPlaybackRate(animation, fallback = 1) {
  return Number.isFinite(animation.playbackRate) ? animation.playbackRate : fallback;
}

function setAnimationPlaybackRate(animation, playbackRate) {
  try {
    animation.playbackRate = playbackRate;
  } catch {
    // The animation may have been removed while the acceleration is easing out.
  }
}

function isFactoryCssAnimation(animation) {
  return (
    animation.playState !== 'idle'
    && (typeof CSSAnimation === 'undefined' || animation instanceof CSSAnimation)
  );
}

function useFactoryAnimationAcceleration(factoryStageRef) {
  const accelerationFrameRef = useRef(0);
  const acceleratedAnimationsRef = useRef([]);

  const cancelAccelerationFrame = useCallback(() => {
    if (accelerationFrameRef.current) {
      cancelAnimationFrame(accelerationFrameRef.current);
      accelerationFrameRef.current = 0;
    }
  }, []);

  const resetFactoryAcceleration = useCallback(() => {
    cancelAccelerationFrame();
    acceleratedAnimationsRef.current.forEach(({ animation, baseRate }) => {
      setAnimationPlaybackRate(animation, baseRate);
    });
    acceleratedAnimationsRef.current = [];
  }, [cancelAccelerationFrame]);

  const accelerateFactoryAnimations = useCallback(() => {
    const factoryStage = factoryStageRef.current;
    if (!factoryStage || typeof factoryStage.getAnimations !== 'function') return;

    const windowObject = factoryStage.ownerDocument.defaultView;
    if (windowObject?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resetFactoryAcceleration();
      return;
    }

    const previousBaseRates = new Map(
      acceleratedAnimationsRef.current.map(({ animation, baseRate }) => [animation, baseRate])
    );
    cancelAccelerationFrame();

    const runningAnimations = factoryStage
      .getAnimations({ subtree: true })
      .filter(isFactoryCssAnimation);

    if (!runningAnimations.length) {
      resetFactoryAcceleration();
      return;
    }

    acceleratedAnimationsRef.current = runningAnimations.map((animation) => {
      const baseRate = previousBaseRates.get(animation) ?? getAnimationPlaybackRate(animation);

      return {
        animation,
        baseRate,
        startRate: getAnimationPlaybackRate(animation, baseRate)
      };
    });

    const accelerationStart = performance.now();
    const updateAcceleration = (timestamp) => {
      const elapsed = Math.max(0, timestamp - accelerationStart);

      acceleratedAnimationsRef.current.forEach(({ animation, baseRate, startRate }) => {
        const peakRate = baseRate * FACTORY_ACCELERATION_RATE;
        let nextRate = baseRate;

        if (elapsed < FACTORY_ACCELERATION_RAMP_UP_MS) {
          nextRate = lerp(
            startRate,
            peakRate,
            smoothStep(clamp(elapsed / FACTORY_ACCELERATION_RAMP_UP_MS, 0, 1))
          );
        } else if (elapsed < FACTORY_ACCELERATION_RAMP_UP_MS + FACTORY_ACCELERATION_HOLD_MS) {
          nextRate = peakRate;
        } else if (elapsed < FACTORY_ACCELERATION_TOTAL_MS) {
          nextRate = lerp(
            peakRate,
            baseRate,
            smoothStep(clamp(
              (elapsed - FACTORY_ACCELERATION_RAMP_UP_MS - FACTORY_ACCELERATION_HOLD_MS)
              / FACTORY_ACCELERATION_RAMP_DOWN_MS,
              0,
              1
            ))
          );
        }

        setAnimationPlaybackRate(animation, nextRate);
      });

      if (elapsed < FACTORY_ACCELERATION_TOTAL_MS) {
        accelerationFrameRef.current = requestAnimationFrame(updateAcceleration);
        return;
      }

      resetFactoryAcceleration();
    };

    accelerationFrameRef.current = requestAnimationFrame(updateAcceleration);
  }, [cancelAccelerationFrame, factoryStageRef, resetFactoryAcceleration]);

  useEffect(() => () => resetFactoryAcceleration(), [resetFactoryAcceleration]);

  return accelerateFactoryAnimations;
}

// Measures the rendered subheadline line width so mobile CTA sizing follows the text.
function useSubheadlineLineWidth(subheadlineRef) {
  const [lineWidth, setLineWidth] = useState(null);

  useEffect(() => {
    const subheadline = subheadlineRef.current;
    if (!subheadline) return undefined;

    let frameId = null;
    let isMounted = true;

    const measureSubheadline = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (!isMounted) return;

        const range = document.createRange();
        range.selectNodeContents(subheadline);
        const lineWidths = Array.from(range.getClientRects())
          .filter((rect) => rect.width > 1 && rect.height > 1)
          .map((rect) => rect.width);
        range.detach();

        const fallbackWidth = subheadline.getBoundingClientRect().width;
        const nextWidth = Math.ceil(lineWidths.length ? Math.max(...lineWidths) : fallbackWidth);
        setLineWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
      });
    };

    measureSubheadline();

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(measureSubheadline);
    resizeObserver?.observe(subheadline);

    window.addEventListener('resize', measureSubheadline);
    document.fonts?.ready?.then(measureSubheadline);

    return () => {
      isMounted = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureSubheadline);
    };
  }, [subheadlineRef]);

  return lineWidth;
}

// Hero section: text, CTAs, ambient atmosphere, and a compositor-driven SVG illustration.
export default function HeroSection() {
  const subheadlineRef = useRef(null);
  const pointerRef = useRef(createPointerState());
  const factoryStageRef = useRef(null);
  const factoryParallaxRef = useRef(null);
  const factoryMotionRef = useRef({
    frameId: 0,
    x: 0,
    y: 0,
    rotate: 0,
    targetX: 0,
    targetY: 0,
    targetRotate: 0
  });
  const accelerateFactoryAnimations = useFactoryAnimationAcceleration(factoryStageRef);
  const subheadlineLineWidth = useSubheadlineLineWidth(subheadlineRef);
  const heroClassName = 'hero-shell section-grid-bg--hero relative isolate overflow-hidden pt-36 pb-28 lg:pt-44 lg:pb-40';
  const heroActionsStyle = useMemo(() => (
    subheadlineLineWidth ? { '--hero-subheadline-inline-width': `${subheadlineLineWidth}px` } : undefined
  ), [subheadlineLineWidth]);

  useEffect(() => () => {
    if (factoryMotionRef.current.frameId) {
      cancelAnimationFrame(factoryMotionRef.current.frameId);
      factoryMotionRef.current.frameId = 0;
    }
  }, []);

  const runFactoryMotion = () => {
    const motion = factoryMotionRef.current;
    const parallaxLayer = factoryParallaxRef.current;

    if (!parallaxLayer) {
      motion.frameId = 0;
      return;
    }

    motion.x += (motion.targetX - motion.x) * 0.14;
    motion.y += (motion.targetY - motion.y) * 0.14;
    motion.rotate += (motion.targetRotate - motion.rotate) * 0.14;

    const remainingMotion = Math.max(
      Math.abs(motion.targetX - motion.x),
      Math.abs(motion.targetY - motion.y),
      Math.abs(motion.targetRotate - motion.rotate)
    );

    if (remainingMotion < 0.01) {
      motion.x = motion.targetX;
      motion.y = motion.targetY;
      motion.rotate = motion.targetRotate;
      motion.frameId = 0;
    } else {
      motion.frameId = requestAnimationFrame(runFactoryMotion);
    }

    parallaxLayer.style.transform = (
      `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, 0) rotate(${motion.rotate.toFixed(3)}deg)`
    );
  };

  const scheduleFactoryMotion = (pointer, isActive) => {
    const motion = factoryMotionRef.current;
    const movement = isActive ? 1 : 0;

    motion.targetX = pointer.shiftX * 12 * movement;
    motion.targetY = pointer.shiftY * -9 * movement;
    motion.targetRotate = pointer.shiftX * 0.42 * movement;

    if (!motion.frameId) {
      motion.frameId = requestAnimationFrame(runFactoryMotion);
    }
  };

  const updatePointer = (nextPointer, nextActive) => {
    pointerRef.current = {
      ...pointerRef.current,
      ...nextPointer,
      active: nextActive,
      repelActive: nextActive
    };

    scheduleFactoryMotion(nextPointer, nextActive);
  };

  const updateTouchPointer = (nextPointer, nextRepelActive) => {
    pointerRef.current = {
      ...pointerRef.current,
      x: nextPointer.x,
      y: nextPointer.y,
      pctX: nextPointer.pctX,
      pctY: nextPointer.pctY,
      shiftX: DEFAULT_POINTER.shiftX,
      shiftY: DEFAULT_POINTER.shiftY,
      active: false,
      repelActive: nextRepelActive
    };
  };

  const endPointer = () => {
    pointerRef.current.active = false;
    pointerRef.current.repelActive = false;
    scheduleFactoryMotion(DEFAULT_POINTER, false);
  };

  const triggerPointerBurst = (pointer) => {
    const now = performance.now();
    pointerRef.current.burstStart = now;
    pointerRef.current.burstUntil = now + POINTER_BURST_MS;
    pointerRef.current.burstX = pointer.x;
    pointerRef.current.burstY = pointer.y;
  };

  const triggerTouchParticleNudge = (pointer) => {
    const now = performance.now();
    const nudgeX = Math.abs(pointer.shiftX) > 0.08 ? pointer.shiftX * -28 : 12;
    const nudgeY = Math.abs(pointer.shiftY) > 0.08 ? pointer.shiftY * -22 : -8;

    pointerRef.current.touchNudgeStart = now;
    pointerRef.current.touchNudgeUntil = now + TOUCH_PARTICLE_NUDGE_MS;
    pointerRef.current.touchNudgeX = nudgeX;
    pointerRef.current.touchNudgeY = nudgeY;
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') {
      if (pointerRef.current.repelActive) updateTouchPointer(getPointerState(e), true);
      return;
    }

    updatePointer(getPointerState(e), true);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') {
      endPointer();
      return;
    }

    endPointer();
  };

  const handlePointerDown = (e) => {
    const p = getPointerState(e);

    if (e.pointerType === 'touch') {
      updateTouchPointer(p, true);
      triggerPointerBurst(p);
      triggerTouchParticleNudge(p);
      accelerateFactoryAnimations();
      return;
    }

    updatePointer(p, true);
    triggerPointerBurst(p);
    accelerateFactoryAnimations();
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') endPointer();
  };

  const handlePointerCancel = () => {
    endPointer();
  };

  return (
    <section
      id="hero"
      className={heroClassName}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div aria-hidden="true" className="hero-atmosphere absolute inset-0 z-0">
        <div className="hero-atmosphere-base absolute inset-0" />
        <div className="section-grid-layer hero-atmosphere-grid absolute inset-0" />
        <HeroParticleField pointerRef={pointerRef} />
        <div className="hero-atmosphere-glow absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-a absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-b absolute inset-0" />

        <div ref={factoryStageRef} className="hero-factory-stage">
          <div ref={factoryParallaxRef} className="hero-factory-parallax">
            <div className="hero-factory-visual">
              <FactoryIllustration />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#081022] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative z-10">
        <div className="hero-reveal hero-content max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-surface-bright backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
            Consulenza Informatica
          </div>
          <div className="md:flex md:w-fit md:flex-col md:items-stretch lg:block lg:w-auto">
            <h1 className="hero-title-balance font-headline text-[3rem] leading-[1.05] tracking-tight text-surface-bright sm:text-[3.4rem] lg:text-[4rem] mb-6">
              Soluzioni digitali
              <br className="hidden md:block" />
              <br className="md:hidden" />
              e innovazione,
              <br className="hidden md:block" />
              <br className="md:hidden" />
              alla portata <br className="md:hidden" />di <span className="text-tertiary-fixed">tutti</span>
            </h1>
            <p ref={subheadlineRef} className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
              Consulenza su misura per
              <br className="lg:hidden" />
              {' '}far crescere il tuo business
            </p>
            <div className="hero-actions flex flex-col lg:flex-row gap-4" style={heroActionsStyle}>
              <a
                href="#contatti"
                className="hero-consultancy-cta inline-flex items-center justify-center px-8 py-4 rounded-md text-[1.0625rem] font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
              >
                <span>Richiedi una Consulenza</span>
              </a>
              <a
                href="#siti-web"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-[1.0625rem] font-medium transition-all duration-300 hover:bg-white/10 active:scale-95"
              >
                Scopri le Soluzioni
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
