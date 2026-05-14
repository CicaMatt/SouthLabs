import { useCallback, useEffect, useRef } from 'react';

const FACTORY_ACCELERATION_RATE = 2.25;
const FACTORY_ACCELERATION_RAMP_UP_MS = 220;
const FACTORY_ACCELERATION_HOLD_MS = 150;
const FACTORY_ACCELERATION_RAMP_DOWN_MS = 760;
const FACTORY_ACCELERATION_TOTAL_MS = (
  FACTORY_ACCELERATION_RAMP_UP_MS
  + FACTORY_ACCELERATION_HOLD_MS
  + FACTORY_ACCELERATION_RAMP_DOWN_MS
);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, progress) => start + (end - start) * progress;
const smoothStep = (progress) => progress * progress * (3 - 2 * progress);

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

export function useFactoryAnimationAcceleration(factoryStageRef) {
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
