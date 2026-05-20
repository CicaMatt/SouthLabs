const SOLUTION_CARD_SURFACE_CLASS = [
  'solution-card-surface overflow-hidden rounded-xl',
  'border-2 backdrop-blur-[0.5px]',
  'motion-safe:transform-gpu motion-safe:transition-all motion-safe:duration-[420ms]',
  'motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
].join(' ');

export function getSolutionCardSurfaceStyle(restOpacity, hoverOpacity = restOpacity, rgb = '251, 252, 254', hoverRgb = rgb) {
  return {
    '--solution-card-bg-rgb': rgb,
    '--solution-card-bg-hover-rgb': hoverRgb,
    '--solution-card-bg-opacity': `${restOpacity}`,
    '--solution-card-bg-hover-opacity': `${hoverOpacity}`
  };
}

export default SOLUTION_CARD_SURFACE_CLASS;
