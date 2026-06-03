import { useEffect } from 'react';

/* Caps the factory illustration's CSS animations to ~60fps on high-refresh
 * displays (120Hz ProMotion, 144Hz, …). The flows animate `stroke-dashoffset`
 * and repaint on the main thread, so at 120Hz they repaint twice as often as
 * the 60fps-throttled particle canvas — for no visible benefit, since the
 * motions are slow.
 *
 * Mechanism: on a high-refresh display we freeze the CSS clock (a class forcing
 * `animation-play-state: paused`, plus a WAAPI pause) and advance each
 * animation's `currentTime` ourselves from a rAF loop gated to ~60fps. We
 * advance by real elapsed time, so playback speed stays accurate, and we read
 * each animation's `playbackRate` so the pointer-down acceleration
 * (useFactoryAnimationAcceleration, which ramps playbackRate) still works.
 *
 * On ~60Hz displays we measure the refresh rate and do nothing — the native,
 * compositor-scheduled animations are left completely untouched.
 *
 * Freeze/thaw piggybacks on the `hero-factory-stage--offscreen` class that
 * useHeroInteractions already toggles for off-screen + tab-hidden (a single
 * source of truth), watched here via a MutationObserver.
 */

const FACTORY_FPS_CAP_CLASS = 'hero-factory-stage--fps-capped';
// Mirrors FACTORY_OFFSCREEN_CLASS in useHeroInteractions.js.
const FACTORY_OFFSCREEN_CLASS = 'hero-factory-stage--offscreen';
/* Just under the 16.67ms 60fps period, so a 120Hz panel flushes on every
   second frame (= 60fps). 60Hz panels never reach the detector threshold. */
const MIN_FLUSH_MS = 15.5;
// Engage only above ~71Hz; a 60Hz panel's frame interval never dips below this.
const HIGH_REFRESH_MAX_INTERVAL_MS = 14;
const REFRESH_SAMPLE_COUNT = 12;

function isCssAnimation(animation) {
  return typeof CSSAnimation === 'undefined' || animation instanceof CSSAnimation;
}

export function useFactoryFpsCap(factoryStageRef) {
  useEffect(() => {
    const stage = factoryStageRef.current;
    const windowObject = stage?.ownerDocument.defaultView;
    if (!stage || !windowObject || typeof stage.getAnimations !== 'function') return undefined;
    if (windowObject.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let animations = [];
    let driveFrame = 0;
    let measureFrame = 0;
    let lastFlush = 0;
    let engaged = false;
    let disposed = false;
    let classObserver = null;

    const drive = (now) => {
      driveFrame = 0;
      if (disposed) return;

      if (lastFlush === 0) lastFlush = now;
      const elapsed = now - lastFlush;
      if (elapsed >= MIN_FLUSH_MS) {
        lastFlush = now;
        for (const animation of animations) {
          try {
            const rate = Number.isFinite(animation.playbackRate) ? animation.playbackRate : 1;
            const current = typeof animation.currentTime === 'number' ? animation.currentTime : 0;
            animation.currentTime = current + elapsed * rate;
          } catch {
            // The animation may have been removed (e.g. reduced-motion toggled on).
          }
        }
      }

      driveFrame = windowObject.requestAnimationFrame(drive);
    };

    const startLoop = () => {
      if (driveFrame || disposed) return;
      lastFlush = 0;
      driveFrame = windowObject.requestAnimationFrame(drive);
    };

    const stopLoop = () => {
      if (driveFrame) {
        windowObject.cancelAnimationFrame(driveFrame);
        driveFrame = 0;
      }
    };

    // Drive only while the factory is on-screen and the tab is visible — both
    // are reflected in the offscreen class toggled by useHeroInteractions.
    const syncFrozenState = () => {
      if (stage.classList.contains(FACTORY_OFFSCREEN_CLASS)) stopLoop();
      else startLoop();
    };

    const engage = () => {
      animations = stage.getAnimations({ subtree: true }).filter(isCssAnimation);
      if (!animations.length) return;

      stage.classList.add(FACTORY_FPS_CAP_CLASS);
      animations.forEach((animation) => {
        try {
          animation.pause();
        } catch {
          // Some animations may already be finished/removed.
        }
      });
      engaged = true;

      if (typeof windowObject.MutationObserver === 'function') {
        classObserver = new windowObject.MutationObserver(syncFrozenState);
        classObserver.observe(stage, { attributes: true, attributeFilter: ['class'] });
      }
      syncFrozenState();
    };

    /* Detect refresh from the shortest observed frame interval, which is immune
       to startup/jank stretching individual frames longer. */
    const intervals = [];
    let previousSample = 0;
    const measure = (now) => {
      measureFrame = 0;
      if (disposed) return;

      if (previousSample) intervals.push(now - previousSample);
      previousSample = now;

      if (intervals.length < REFRESH_SAMPLE_COUNT) {
        measureFrame = windowObject.requestAnimationFrame(measure);
        return;
      }

      if (Math.min(...intervals) < HIGH_REFRESH_MAX_INTERVAL_MS) engage();
    };
    measureFrame = windowObject.requestAnimationFrame(measure);

    return () => {
      disposed = true;
      stopLoop();
      if (measureFrame) windowObject.cancelAnimationFrame(measureFrame);
      classObserver?.disconnect();
      if (engaged) {
        stage.classList.remove(FACTORY_FPS_CAP_CLASS);
        animations.forEach((animation) => {
          try {
            animation.play();
          } catch {
            // The animation may have been removed before cleanup.
          }
        });
      }
    };
  }, [factoryStageRef]);
}
