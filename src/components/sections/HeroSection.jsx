import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FactoryIllustration from '../hero/FactoryIllustration';
import HeroParticleField, { POINTER_BURST_MS } from '../hero/HeroParticleField';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const BOOST_PLAYBACK_RATE = 2.8;
const BOOST_DURATION_MS = 520;
const TOUCH_PARTICLE_NUDGE_MS = 720;
const POINTER_RETURN_GLOW_MS = 2400;
const POINTER_RETURN_OPACITY_MS = 720;
const POINTER_RETURN_FACTORY_MS = 1600;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Converts pointer position into CSS variables for the hero parallax/glow effects.
function getPointerState(e) {
  const b = e.currentTarget.getBoundingClientRect();
  const rx = clamp((e.clientX - b.left) / b.width, 0, 1);
  const ry = clamp((e.clientY - b.top) / b.height, 0, 1);
  return {
    x:      Number((e.clientX - b.left).toFixed(2)),
    y:      Number((e.clientY - b.top).toFixed(2)),
    pctX:   Number((rx * 100).toFixed(2)),
    pctY:   Number((ry * 100).toFixed(2)),
    shiftX: Number(((rx - 0.5) * 2).toFixed(4)),
    shiftY: Number(((ry - 0.5) * 2).toFixed(4))
  };
}

function getDefaultPointerState(heroElement) {
  const b = heroElement?.getBoundingClientRect();
  return {
    ...DEFAULT_POINTER,
    x: b ? Number((b.width * DEFAULT_POINTER.pctX / 100).toFixed(2)) : -1,
    y: b ? Number((b.height * DEFAULT_POINTER.pctY / 100).toFixed(2)) : -1
  };
}

// Temporarily speeds up SVG animations when the hero is pressed/clicked.
function useFactoryAnimationBoost(factorySvgRef) {
  const boostTimeoutRef = useRef(null);
  const boostedAnimationsRef = useRef([]);

  const resetFactoryBoost = useCallback(() => {
    if (boostTimeoutRef.current !== null) {
      clearTimeout(boostTimeoutRef.current);
      boostTimeoutRef.current = null;
    }
    boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
      animation.playbackRate = playbackRate;
    });
    boostedAnimationsRef.current = [];
  }, []);

  const boostFactoryAnimations = useCallback(() => {
    const factorySvg = factorySvgRef.current;
    if (!factorySvg || typeof factorySvg.getAnimations !== 'function') return;

    resetFactoryBoost();
    const runningAnimations = factorySvg
      .getAnimations({ subtree: true })
      .filter((animation) => typeof CSSAnimation === 'undefined' || animation instanceof CSSAnimation);

    if (!runningAnimations.length) return;

    boostedAnimationsRef.current = runningAnimations.map((animation) => ({
      animation,
      playbackRate: animation.playbackRate || 1
    }));

    boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
      animation.playbackRate = playbackRate * BOOST_PLAYBACK_RATE;
    });

    boostTimeoutRef.current = setTimeout(() => {
      boostedAnimationsRef.current.forEach(({ animation, playbackRate }) => {
        animation.playbackRate = playbackRate;
      });
      boostedAnimationsRef.current = [];
      boostTimeoutRef.current = null;
    }, BOOST_DURATION_MS);
  }, [resetFactoryBoost]);

  useEffect(() => () => resetFactoryBoost(), [resetFactoryBoost]);

  return boostFactoryAnimations;
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

// Interactive hero section: text, CTAs, pointer-driven atmosphere, and animated SVG.
export default function HeroSection() {
  const [isActive, setIsActive] = useState(false);
  const heroRef = useRef(null);
  const subheadlineRef = useRef(null);
  const factorySvgRef = useRef(null);
  const pointerRef = useRef({
    ...DEFAULT_POINTER,
    x: -1,
    y: -1,
    active: false,
    touchNudgeStart: 0,
    touchNudgeUntil: 0,
    touchNudgeX: 0,
    touchNudgeY: 0,
    burstStart: 0,
    burstUntil: 0,
    burstX: -1,
    burstY: -1,
    repelActive: false
  });
  const pointerActiveRef = useRef(false);
  const styleFrameRef = useRef(null);
  const transitionTimingModeRef = useRef('idle');
  const boostFactoryAnimations = useFactoryAnimationBoost(factorySvgRef);
  const subheadlineLineWidth = useSubheadlineLineWidth(subheadlineRef);

  const setHeroTransitionMode = useCallback((mode) => {
    if (transitionTimingModeRef.current === mode) return;

    const heroElement = heroRef.current;
    if (!heroElement) return;

    const isReturnMode = mode === 'return';
    heroElement.style.setProperty(
      '--hero-glow-position-duration',
      isReturnMode ? `${POINTER_RETURN_GLOW_MS}ms` : '90ms'
    );
    heroElement.style.setProperty(
      '--hero-glow-position-ease',
      isReturnMode ? 'cubic-bezier(0.16, 0.82, 0.14, 1)' : 'linear'
    );
    heroElement.style.setProperty(
      '--hero-glow-opacity-duration',
      isReturnMode ? `${POINTER_RETURN_OPACITY_MS}ms` : '160ms'
    );
    heroElement.style.setProperty(
      '--hero-factory-motion-duration',
      isReturnMode ? `${POINTER_RETURN_FACTORY_MS}ms` : '180ms'
    );
    heroElement.style.setProperty(
      '--hero-factory-motion-ease',
      isReturnMode ? 'cubic-bezier(0.16, 0.82, 0.14, 1)' : 'ease-out'
    );
    transitionTimingModeRef.current = mode;
  }, []);

  const applyPointerStyle = useCallback(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const pointer = pointerRef.current;
    heroElement.style.setProperty('--hero-pointer-x', `${pointer.pctX}%`);
    heroElement.style.setProperty('--hero-pointer-y', `${pointer.pctY}%`);
    heroElement.style.setProperty('--hero-shift-x', `${pointer.shiftX}`);
    heroElement.style.setProperty('--hero-shift-y', `${pointer.shiftY}`);
    heroElement.style.setProperty('--hero-active', pointer.active ? '1' : '0');
  }, []);

  const schedulePointerStyle = useCallback(() => {
    if (styleFrameRef.current !== null) return;

    styleFrameRef.current = requestAnimationFrame(() => {
      styleFrameRef.current = null;
      applyPointerStyle();
    });
  }, [applyPointerStyle]);

  const setPointerActive = useCallback((nextActive) => {
    pointerRef.current.active = nextActive;
    if (pointerActiveRef.current !== nextActive) {
      pointerActiveRef.current = nextActive;
      setIsActive(nextActive);
    }
  }, []);

  const updatePointer = useCallback((nextPointer, nextActive) => {
    pointerRef.current = {
      ...pointerRef.current,
      ...nextPointer,
      active: nextActive,
      repelActive: nextActive
    };
    setPointerActive(nextActive);
    schedulePointerStyle();
  }, [schedulePointerStyle, setPointerActive]);

  const updateTouchPointer = useCallback((nextPointer, nextRepelActive) => {
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
    setPointerActive(false);
    schedulePointerStyle();
  }, [schedulePointerStyle, setPointerActive]);

  const endTouchPointer = useCallback(() => {
    pointerRef.current.repelActive = false;
    setPointerActive(false);
    schedulePointerStyle();
  }, [schedulePointerStyle, setPointerActive]);

  const triggerTouchParticleNudge = useCallback((pointer) => {
    const now = performance.now();
    const nudgeX = Math.abs(pointer.shiftX) > 0.08 ? pointer.shiftX * -28 : 12;
    const nudgeY = Math.abs(pointer.shiftY) > 0.08 ? pointer.shiftY * -22 : -8;
    pointerRef.current.touchNudgeStart = now;
    pointerRef.current.touchNudgeUntil = now + TOUCH_PARTICLE_NUDGE_MS;
    pointerRef.current.touchNudgeX = nudgeX;
    pointerRef.current.touchNudgeY = nudgeY;
  }, []);

  const triggerPointerBurst = useCallback((pointer) => {
    const now = performance.now();
    pointerRef.current.burstStart = now;
    pointerRef.current.burstUntil = now + POINTER_BURST_MS;
    pointerRef.current.burstX = pointer.x;
    pointerRef.current.burstY = pointer.y;
  }, []);

  useEffect(() => () => {
    if (styleFrameRef.current !== null) cancelAnimationFrame(styleFrameRef.current);
  }, []);

  const handlePointerMove  = (e) => {
    if (e.pointerType === 'touch') {
      if (pointerRef.current.repelActive) updateTouchPointer(getPointerState(e), true);
      return;
    }
    setHeroTransitionMode('active');
    updatePointer(getPointerState(e), true);
  };
  const handlePointerLeave = (e)  => {
    if (e.pointerType === 'touch') {
      endTouchPointer();
      return;
    }
    setHeroTransitionMode('return');
    updatePointer(getDefaultPointerState(heroRef.current), false);
  };
  const handlePointerDown  = (e) => {
    setHeroTransitionMode('active');
    if (e.pointerType === 'touch') {
      const p = getPointerState(e);
      updateTouchPointer(p, true);
      triggerPointerBurst(p);
      triggerTouchParticleNudge(p);
      boostFactoryAnimations();
      return;
    }
    const p = getPointerState(e);
    updatePointer(p, true);
    triggerPointerBurst(p);
    boostFactoryAnimations();
  };
  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') endTouchPointer();
  };

  const heroStyle = useMemo(() => ({
    '--hero-pointer-x': `${DEFAULT_POINTER.pctX}%`,
    '--hero-pointer-y': `${DEFAULT_POINTER.pctY}%`,
    '--hero-shift-x':   `${DEFAULT_POINTER.shiftX}`,
    '--hero-shift-y':   `${DEFAULT_POINTER.shiftY}`,
    '--hero-active':    '0'
  }), []);
  const heroClassName = [
    'hero-shell relative isolate overflow-hidden bg-primary pt-32 pb-24 lg:pt-40 lg:pb-36',
    isActive ? 'hero-shell--pointer-active' : ''
  ].filter(Boolean).join(' ');
  const heroActionsStyle = useMemo(() => (
    subheadlineLineWidth ? { '--hero-subheadline-inline-width': `${subheadlineLineWidth}px` } : undefined
  ), [subheadlineLineWidth]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={heroClassName}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={heroStyle}
    >
      <div aria-hidden="true" className="hero-atmosphere absolute inset-0 z-0">
        <div className="hero-atmosphere-base absolute inset-0" />
        <div className="hero-atmosphere-grid absolute inset-0" />
        <HeroParticleField pointerRef={pointerRef} />
        <div className="hero-atmosphere-glow absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-a absolute inset-0" />
        <div className="hero-atmosphere-stream hero-atmosphere-stream-b absolute inset-0" />

        <div className="hero-factory-stage">
          <FactoryIllustration svgRef={factorySvgRef} />
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
              alla portata di <br className="md:hidden" /><span className="text-tertiary-fixed">tutti</span>
            </h1>
            <p ref={subheadlineRef} className="font-body text-lg text-[#d4dbea] mb-10 max-w-2xl leading-relaxed sm:text-xl">
              Consulenza su misura per
              <br className="lg:hidden" />
              {' '}far crescere il tuo business
            </p>
            <div className="hero-actions flex flex-col lg:flex-row gap-4" style={heroActionsStyle}>
              <a
                href="#contatti"
                className="hero-consultancy-cta inline-flex items-center justify-center px-8 py-4 rounded-md text-base font-medium transition-all duration-300 bg-gradient-to-br from-tertiary-fixed to-[#9ce6fb] text-[#06222a] shadow-[0_18px_45px_rgba(12,35,46,0.45)] hover:shadow-[0_22px_55px_rgba(12,35,46,0.58)] active:scale-95"
              >
                Richiedi una Consulenza
              </a>
              <a
                href="#siti-web"
                className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/25 bg-white/5 text-surface-bright text-base font-medium transition-all duration-300 hover:bg-white/10 active:scale-95"
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
