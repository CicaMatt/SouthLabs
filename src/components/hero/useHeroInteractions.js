import { useEffect, useRef } from 'react';
import { useFactoryAnimationAcceleration } from './useFactoryAnimationAcceleration';

const DEFAULT_POINTER = { pctX: 72, pctY: 42, shiftX: 0.18, shiftY: -0.1 };
const POINTER_BURST_MS = 460;
const TOUCH_PARTICLE_NUDGE_MS = 720;
const HOVER_LIGHT_ACTIVE_OPACITY = 0.95;
const HOVER_LIGHT_CORE_OPACITY = 0.82;
const HOVER_LIGHT_PULSE_MS = 1040;
const FACTORY_PARALLAX_SHIFT_PX = 12;
const FACTORY_PARALLAX_EASE = 0.14;
const HOVER_LIGHT_POSITION_EASE = 0.24;
const HOVER_LIGHT_OPACITY_EASE = 0.22;
const HOVER_LIGHT_SCALE_EASE = 0.18;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createPointerState() {
  return {
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
  };
}

function readPointerFromEvent(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const rx = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  const ry = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
    pctX: rx * 100,
    pctY: ry * 100,
    shiftX: (rx - 0.5) * 2,
    shiftY: (ry - 0.5) * 2
  };
}

export function useHeroInteractions() {
  const pointerRef = useRef(createPointerState());
  const factoryStageRef = useRef(null);
  const factoryParallaxRef = useRef(null);
  const hoverLightRef = useRef(null);
  const hoverLightCoreRef = useRef(null);
  const factoryMotionRef = useRef({ frameId: 0, x: 0, targetX: 0 });
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
  const hoverLightPulseRef = useRef(null);
  const accelerateFactoryAnimations = useFactoryAnimationAcceleration(factoryStageRef);

  useEffect(() => () => {
    if (factoryMotionRef.current.frameId) {
      cancelAnimationFrame(factoryMotionRef.current.frameId);
      factoryMotionRef.current.frameId = 0;
    }
    if (hoverLightMotionRef.current.frameId) {
      cancelAnimationFrame(hoverLightMotionRef.current.frameId);
      hoverLightMotionRef.current.frameId = 0;
    }
    hoverLightPulseRef.current?.cancel();
    hoverLightPulseRef.current = null;
  }, []);

  const runFactoryParallax = () => {
    const motion = factoryMotionRef.current;
    const parallaxLayer = factoryParallaxRef.current;
    if (!parallaxLayer) {
      motion.frameId = 0;
      return;
    }

    motion.x += (motion.targetX - motion.x) * FACTORY_PARALLAX_EASE;
    if (Math.abs(motion.targetX - motion.x) < 0.01) {
      motion.x = motion.targetX;
      motion.frameId = 0;
    } else {
      motion.frameId = requestAnimationFrame(runFactoryParallax);
    }

    parallaxLayer.style.transform = `translate3d(${motion.x.toFixed(2)}px, 0, 0)`;
  };

  const scheduleFactoryParallax = (pointer, isActive) => {
    const motion = factoryMotionRef.current;
    motion.targetX = isActive ? pointer.shiftX * FACTORY_PARALLAX_SHIFT_PX : 0;
    if (!motion.frameId) {
      motion.frameId = requestAnimationFrame(runFactoryParallax);
    }
  };

  const runHoverLight = () => {
    const motion = hoverLightMotionRef.current;
    const hoverLight = hoverLightRef.current;
    if (!hoverLight) {
      motion.frameId = 0;
      return;
    }

    motion.x += (motion.targetX - motion.x) * HOVER_LIGHT_POSITION_EASE;
    motion.y += (motion.targetY - motion.y) * HOVER_LIGHT_POSITION_EASE;
    motion.opacity += (motion.targetOpacity - motion.opacity) * HOVER_LIGHT_OPACITY_EASE;
    motion.scale += (motion.targetScale - motion.scale) * HOVER_LIGHT_SCALE_EASE;

    const remaining = Math.max(
      Math.abs(motion.targetX - motion.x),
      Math.abs(motion.targetY - motion.y),
      Math.abs(motion.targetOpacity - motion.opacity) * 100,
      Math.abs(motion.targetScale - motion.scale) * 100
    );
    if (remaining < 0.02) {
      motion.x = motion.targetX;
      motion.y = motion.targetY;
      motion.opacity = motion.targetOpacity;
      motion.scale = motion.targetScale;
      motion.frameId = 0;
    } else {
      motion.frameId = requestAnimationFrame(runHoverLight);
    }

    hoverLight.style.opacity = motion.opacity.toFixed(3);
    hoverLight.style.transform = (
      `translate3d(${motion.x.toFixed(2)}px, ${motion.y.toFixed(2)}px, 0) `
      + `translate(-50%, -50%) scale(${motion.scale.toFixed(3)})`
    );
  };

  const scheduleHoverLight = (pointer, isVisible) => {
    const motion = hoverLightMotionRef.current;
    const hasPosition = pointer.x >= 0 && pointer.y >= 0;
    if (isVisible && !hasPosition) return;

    const shouldAnchor = isVisible && (
      !motion.initialized
      || motion.targetOpacity === 0
      || motion.opacity < 0.04
    );
    if (shouldAnchor) {
      motion.x = pointer.x;
      motion.y = pointer.y;
      motion.initialized = true;
    }
    if (hasPosition) {
      motion.targetX = pointer.x;
      motion.targetY = pointer.y;
    }
    motion.targetOpacity = isVisible ? HOVER_LIGHT_ACTIVE_OPACITY : 0;
    motion.targetScale = isVisible ? 1 : 0.92;

    if (!motion.frameId) {
      motion.frameId = requestAnimationFrame(runHoverLight);
    }
  };

  const triggerHoverLightPulse = () => {
    const core = hoverLightCoreRef.current;
    const windowObject = core?.ownerDocument.defaultView;
    if (!core || !windowObject || typeof core.animate !== 'function') return;

    const canHover = windowObject.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const shouldReduceMotion = windowObject.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || shouldReduceMotion) return;

    hoverLightPulseRef.current?.cancel();
    const pulse = core.animate(
      [
        { transform: 'scale(1)', opacity: HOVER_LIGHT_CORE_OPACITY },
        { transform: 'scale(1.18)', opacity: 1, offset: 0.6 },
        { transform: 'scale(1)', opacity: HOVER_LIGHT_CORE_OPACITY }
      ],
      { duration: HOVER_LIGHT_PULSE_MS, easing: 'cubic-bezier(0.22, 0.74, 0.2, 1)' }
    );
    hoverLightPulseRef.current = pulse;
    const clearPulse = () => { hoverLightPulseRef.current = null; };
    pulse.onfinish = clearPulse;
    pulse.oncancel = clearPulse;
  };

  const applyPointer = (pointer, isActive) => {
    Object.assign(pointerRef.current, pointer, {
      active: isActive,
      repelActive: isActive
    });
    scheduleFactoryParallax(pointer, isActive);
    scheduleHoverLight(pointer, isActive);
  };

  const applyTouchPointer = (pointer, isRepelActive) => {
    Object.assign(pointerRef.current, {
      x: pointer.x,
      y: pointer.y,
      pctX: pointer.pctX,
      pctY: pointer.pctY,
      shiftX: DEFAULT_POINTER.shiftX,
      shiftY: DEFAULT_POINTER.shiftY,
      active: false,
      repelActive: isRepelActive
    });
  };

  const endPointer = () => {
    pointerRef.current.active = false;
    pointerRef.current.repelActive = false;
    scheduleFactoryParallax(DEFAULT_POINTER, false);
    scheduleHoverLight(pointerRef.current, false);
  };

  const triggerPointerBurst = (pointer) => {
    const now = performance.now();
    const state = pointerRef.current;
    state.burstStart = now;
    state.burstUntil = now + POINTER_BURST_MS;
    state.burstX = pointer.x;
    state.burstY = pointer.y;
  };

  const triggerTouchParticleNudge = (pointer) => {
    const now = performance.now();
    const state = pointerRef.current;
    state.touchNudgeStart = now;
    state.touchNudgeUntil = now + TOUCH_PARTICLE_NUDGE_MS;
    state.touchNudgeX = Math.abs(pointer.shiftX) > 0.08 ? pointer.shiftX * -28 : 12;
    state.touchNudgeY = Math.abs(pointer.shiftY) > 0.08 ? pointer.shiftY * -22 : -8;
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') {
      if (pointerRef.current.repelActive) applyTouchPointer(readPointerFromEvent(event), true);
      return;
    }
    applyPointer(readPointerFromEvent(event), true);
  };

  const handlePointerDown = (event) => {
    const pointer = readPointerFromEvent(event);
    if (event.pointerType === 'touch') {
      applyTouchPointer(pointer, true);
      triggerPointerBurst(pointer);
      triggerTouchParticleNudge(pointer);
      accelerateFactoryAnimations();
      return;
    }
    applyPointer(pointer, true);
    triggerPointerBurst(pointer);
    triggerHoverLightPulse();
    accelerateFactoryAnimations();
  };

  const handlePointerUp = (event) => {
    if (event.pointerType === 'touch') endPointer();
  };

  return {
    pointerRef,
    factoryStageRef,
    factoryParallaxRef,
    hoverLightRef,
    hoverLightCoreRef,
    heroEventHandlers: {
      onPointerDown: handlePointerDown,
      onPointerEnter: handlePointerMove,
      onPointerLeave: endPointer,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: endPointer
    }
  };
}
