/* Single source of truth for the hero factory illustration's collision shapes,
 * in the SVG viewBox coordinate space (0 0 600 540). Two consumers share these
 * so the magic coordinates live in exactly one place:
 *   - HeroParticleField, to keep particles from drawing over the factory.
 *   - sectionGrid/heroGraphicHitTest, to shrink the custom cursor over it.
 * Polygons are `[x, y]` point arrays (no repeated closing point). */

export const FACTORY_VIEWBOX = { x: 0, y: 0, width: 600, height: 540 };

// Factory building outline.
export const FACTORY_BODY_POLYGON = [
  [126, 500],
  [126, 391],
  [380, 264],
  [494, 337],
  [494, 500]
];

// Chimney / pipe outline.
export const PIPE_BODY_POLYGON = [
  [236, 336],
  [252, 210],
  [290, 210],
  [306, 301]
];

// Ground strip beneath the factory.
export const FACTORY_BASE_STRIP = { left: 76, top: 500, right: 544, bottom: 520 };
export const FACTORY_BASE_STRIP_POLYGON = [
  [FACTORY_BASE_STRIP.left, FACTORY_BASE_STRIP.top],
  [FACTORY_BASE_STRIP.right, FACTORY_BASE_STRIP.top],
  [FACTORY_BASE_STRIP.right, FACTORY_BASE_STRIP.bottom],
  [FACTORY_BASE_STRIP.left, FACTORY_BASE_STRIP.bottom]
];
