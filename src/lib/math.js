/* Small numeric helpers shared across the animation and interaction modules. */

export const TAU = Math.PI * 2;

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const lerp = (a, b, t) => a + (b - a) * t;

/* Hermite smoothstep. Callers pass an already-normalised [0, 1] progress. */
export const smoothStep = (t) => t * t * (3 - 2 * t);
