import { useEffect, useRef } from 'react';
import FactoryIllustration from '../hero/FactoryIllustration';
import HeroParticleField from '../hero/HeroParticleField';
import { useFactoryAnimationAcceleration, useSubheadlineLineWidth } from '../hero/heroMotionHooks';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const POINTER_BURST_MS = 460;
const TOUCH_PARTICLE_NUDGE_MS = 720;
const HOVER_LIGHT_ACTIVE_OPACITY = 0.95;
const HOVER_LIGHT_CORE_OPACITY = 0.82;
const HOVER_LIGHT_PULSE_MS = 1040;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const createPointerState = () => ({
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
  touchNudgeY: 0
});

function getPointerState(e) {
  const b = e.currentTarget.getBoundingClientRect();
  const rx = clamp((e.clientX - b.left) / b.width, 0, 1);
  const ry = clamp((e.clientY - b.top) / b.height, 0, 1);

  return {
    x: e.clientX - b.left,
    y: e.clientY - b.top,
    pctX: rx * 100,
    pctY: ry * 100,
    shiftX: (rx - 0.5) * 2,
    shiftY: (ry - 0.5) * 2
  };
}

// Hero section: text, CTAs, ambient atmosphere, and a compositor-driven SVG illustration.
export default function HeroSection() {
  const subheadlineRef = useRef(null);
  const pointerRef = useRef(createPointerState());
  const factoryStageRef = useRef(null);
  const factoryParallaxRef = useRef(null);
  const hoverLightRef = useRef(null);
  const hoverLightCoreRef = useRef(null);
  const hoverLightPulseAnimationRef = useRef(null);
  const factoryMotionRef = useRef({
    frameId: 0,
    x: 0,
    targetX: 0
  });
  const hoverLightMotionRef = useRef({
    frameId: 0,
    initialized: false,
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.92,
    targetX: 0,
    targetY: 0,
    targetOpacity: 0,
    targetScale: 0.92
  });
  const accelerateFactoryAnimations = useFactoryAnimationAcceleration(factoryStageRef);
  const subheadlineLineWidth = useSubheadlineLineWidth(subheadlineRef);
  const heroClassName = 'hero-shell section-grid-bg--hero relative isolate overflow-hidden pt-36 pb-28 lg:pt-44 lg:pb-40';
  const heroActionsStyle = subheadlineLineWidth
    ? { '--hero-subheadline-inline-width': `${subheadlineLineWidth}px` }
    : undefined;

  useEffect(() => () => {
    if (factoryMotionRef.current.frameId) {
      cancelAnimationFrame(factoryMotionRef.current.frameId);
      factoryMotionRef.current.frameId = 0;
    }

    if (hoverLightMotionRef.current.frameId) {
      cancelAnimationFrame(hoverLightMotionRef.current.frameId);
      hoverLightMotionRef.current.frameId = 0;
    }

    hoverLightPulseAnimationRef.current?.cancel();
    hoverLightPulseAnimationRef.current = null;
  }, []);

  const runFactoryMotion = () => {
    const motion = factoryMotionRef.current;
    const parallaxLayer = factoryParallaxRef.current;

    if (!parallaxLayer) {
      motion.frameId = 0;
      return;
    }

    motion.x += (motion.targetX - motion.x) * 0.14;
    const remainingMotion = Math.abs(motion.targetX - motion.x);

    if (remainingMotion < 0.01) {
      motion.x = motion.targetX;
      motion.frameId = 0;
    } else {
      motion.frameId = requestAnimationFrame(runFactoryMotion);
    }

    parallaxLayer.style.transform = (
      `translate3d(${motion.x.toFixed(2)}px, 0, 0)`
    );
  };

  const scheduleFactoryMotion = (pointer, isActive) => {
    const motion = factoryMotionRef.current;
    const movement = isActive ? 1 : 0;

    motion.targetX = pointer.shiftX * 12 * movement;

    if (!motion.frameId) {
      motion.frameId = requestAnimationFrame(runFactoryMotion);
    }
  };

  const runHoverLightMotion = () => {
    const motion = hoverLightMotionRef.current;
    const hoverLight = hoverLightRef.current;

    if (!hoverLight) {
      motion.frameId = 0;
      return;
    }

    motion.x += (motion.targetX - motion.x) * 0.24;
    motion.y += (motion.targetY - motion.y) * 0.24;
    motion.opacity += (motion.targetOpacity - motion.opacity) * 0.22;
    motion.scale += (motion.targetScale - motion.scale) * 0.18;

    const remainingMotion = Math.max(
      Math.abs(motion.targetX - motion.x),
      Math.abs(motion.targetY - motion.y),
      Math.abs(motion.targetOpacity - motion.opacity) * 100,
      Math.abs(motion.targetScale - motion.scale) * 100
    );

    if (remainingMotion < 0.02) {
      motion.x = motion.targetX;
      motion.y = motion.targetY;
      motion.opacity = motion.targetOpacity;
      motion.scale = motion.targetScale;
      motion.frameId = 0;
    } else {
      motion.frameId = requestAnimationFrame(runHoverLightMotion);
    }

    hoverLight.style.opacity = motion.opacity.toFixed(3);
    hoverLight.style.transform = (
      `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, 0) `
      + `translate(-50%, -50%) scale(${motion.scale.toFixed(3)})`
    );
  };

  const scheduleHoverLightMotion = (pointer, isVisible) => {
    const motion = hoverLightMotionRef.current;
    const hasPointerPosition = pointer.x >= 0 && pointer.y >= 0;

    if (isVisible && !hasPointerPosition) return;

    const shouldAnchorImmediately = isVisible && (
      !motion.initialized
      || motion.targetOpacity === 0
      || motion.opacity < 0.04
    );
    if (shouldAnchorImmediately) {
      motion.x = pointer.x;
      motion.y = pointer.y;
      motion.initialized = true;
    }

    if (hasPointerPosition) {
      motion.targetX = pointer.x;
      motion.targetY = pointer.y;
    }
    motion.targetOpacity = isVisible ? HOVER_LIGHT_ACTIVE_OPACITY : 0;
    motion.targetScale = isVisible ? 1 : 0.92;

    if (!motion.frameId) {
      motion.frameId = requestAnimationFrame(runHoverLightMotion);
    }
  };

  const triggerHoverLightPulse = () => {
    const hoverLightCore = hoverLightCoreRef.current;
    const windowObject = hoverLightCore?.ownerDocument.defaultView;
    if (!hoverLightCore || !windowObject || typeof hoverLightCore.animate !== 'function') return;

    const canHover = windowObject.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const shouldReduceMotion = windowObject.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || shouldReduceMotion) return;

    hoverLightPulseAnimationRef.current?.cancel();
    hoverLightPulseAnimationRef.current = hoverLightCore.animate(
      [
        { transform: 'scale(1)', opacity: HOVER_LIGHT_CORE_OPACITY },
        { transform: 'scale(1.18)', opacity: 1, offset: 0.6 },
        { transform: 'scale(1)', opacity: HOVER_LIGHT_CORE_OPACITY }
      ],
      {
        duration: HOVER_LIGHT_PULSE_MS,
        easing: 'cubic-bezier(0.22, 0.74, 0.2, 1)'
      }
    );

    hoverLightPulseAnimationRef.current.onfinish = () => {
      hoverLightPulseAnimationRef.current = null;
    };
    hoverLightPulseAnimationRef.current.oncancel = () => {
      hoverLightPulseAnimationRef.current = null;
    };
  };

  const updatePointer = (nextPointer, nextActive) => {
    Object.assign(pointerRef.current, nextPointer, {
      active: nextActive,
      repelActive: nextActive
    });

    scheduleFactoryMotion(nextPointer, nextActive);
    scheduleHoverLightMotion(nextPointer, nextActive);
  };

  const updateTouchPointer = (nextPointer, nextRepelActive) => {
    Object.assign(pointerRef.current, {
      x: nextPointer.x,
      y: nextPointer.y,
      pctX: nextPointer.pctX,
      pctY: nextPointer.pctY,
      shiftX: DEFAULT_POINTER.shiftX,
      shiftY: DEFAULT_POINTER.shiftY,
      active: false,
      repelActive: nextRepelActive
    });
  };

  const endPointer = () => {
    pointerRef.current.active = false;
    pointerRef.current.repelActive = false;
    scheduleFactoryMotion(DEFAULT_POINTER, false);
    scheduleHoverLightMotion(pointerRef.current, false);
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
    triggerHoverLightPulse();
    accelerateFactoryAnimations();
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') endPointer();
  };

  return (
    <section
      id="hero"
      className={heroClassName}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerMove}
      onPointerLeave={endPointer}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={endPointer}
    >
      <div aria-hidden="true" className="hero-atmosphere absolute inset-0 z-0">
        <div className="hero-atmosphere-base absolute inset-0" />
        <div className="section-grid-layer hero-atmosphere-grid absolute inset-0" />
        <HeroParticleField pointerRef={pointerRef} />
        <div className="hero-atmosphere-glow absolute inset-0" />
        <div ref={hoverLightRef} className="hero-hover-light">
          <span ref={hoverLightCoreRef} className="hero-hover-light-core" />
        </div>
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
