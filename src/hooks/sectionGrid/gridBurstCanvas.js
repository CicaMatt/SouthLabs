/* Canvas-based grid burst renderer.
 *
 * Why a canvas: the original grid-lines-in-a-growing-circle effect inherently
 * needs per-frame work to grow the visible reveal. Implementing that with
 * CSS `mask-image` (whose radius is animated) forces the browser to
 * re-rasterize a radial-gradient mask and re-composite the masked layer every
 * frame — under rapid clicks with multiple concurrent burst elements, that
 * saturates the rasterizer and produces drop-frame flicker. A `<canvas>` lets
 * us run a single rAF loop that issues a few dozen `fillRect` calls per active
 * burst per frame. That stays well under 1 ms on any modern device and
 * cannot interact poorly with section content-visibility, ResizeObservers,
 * compositor layer promotion, or any of the other CSS-side cascade triggers
 * we've already eliminated. It is, by construction, flicker-proof.
 *
 * The canvas is `position: fixed`, viewport-sized. Active bursts live in
 * page-coordinate space; each frame we translate to viewport coordinates
 * using the current `scrollX/scrollY`, so scroll-during-burst is handled for
 * free with no scroll event listener needed. The rAF loop only runs while
 * there is at least one active burst.
 */

const BURST_DURATION_MS = 800;
const BURST_LINE_WIDTH = 2;
const PEAK_PROGRESS = 0.1;
const PEAK_OPACITY_FACTOR = 0.52;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

/* Smoothed step within [from, to], producing the same eased feel as the
   previous cubic-bezier(0.2, 0.72, 0.18, 1) CSS keyframes. We use a
   smoothstep here — visually indistinguishable from the bezier for our timing
   bands and avoids shipping a full bezier solver. */
function smoothStep(t) {
  const clamped = clamp(t, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

/* Reconstruct radius and opacity from progress (0..1). */
function sampleBurstShape(progress, maxRadius) {
  if (progress <= 0) return { radius: 0, opacity: 0 };
  if (progress >= 1) return { radius: maxRadius, opacity: 0 };

  if (progress < PEAK_PROGRESS) {
    const t = smoothStep(progress / PEAK_PROGRESS);
    return {
      radius: lerp(maxRadius * 0.13, maxRadius * 0.27, t),
      opacity: lerp(0, PEAK_OPACITY_FACTOR, t)
    };
  }
  /* Release phase: keep the leading edge expanding and fade the grid out on
     one continuous curve so there is no late-phase plateau or fade kink. */
  const t = smoothStep((progress - PEAK_PROGRESS) / (1 - PEAK_PROGRESS));
  return {
    radius: lerp(maxRadius * 0.27, maxRadius, t),
    opacity: lerp(PEAK_OPACITY_FACTOR, 0, t)
  };
}

/* Cap on simultaneously active bursts. The renderer can comfortably handle
   far more, but a cap prevents pathological cases (e.g., a script flooding
   the queue) from ever building up. */
const MAX_ACTIVE_BURSTS = 16;

export function createGridBurstCanvasController(canvas) {
  if (!canvas) return null;
  const ownerDocument = canvas.ownerDocument;
  const windowObject = ownerDocument?.defaultView;
  if (!windowObject) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const bursts = [];
  let rafHandle = 0;
  let dpr = 1;
  let viewportWidth = 0;
  let viewportHeight = 0;

  const sizeCanvas = () => {
    dpr = windowObject.devicePixelRatio || 1;
    viewportWidth = windowObject.innerWidth || 0;
    viewportHeight = windowObject.innerHeight || 0;
    /* Set the backing-store size to physical pixels so output is crisp on
       high-DPI displays; keep the CSS box at logical pixels so the canvas
       overlays the viewport 1:1. */
    canvas.width = Math.max(1, Math.floor(viewportWidth * dpr));
    canvas.height = Math.max(1, Math.floor(viewportHeight * dpr));
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawBurst = (burst, now, scrollX, scrollY) => {
    const elapsed = now - burst.startTime;
    if (elapsed >= BURST_DURATION_MS) return false;
    const progress = elapsed / BURST_DURATION_MS;
    const { radius, opacity } = sampleBurstShape(progress, burst.maxRadius);
    if (opacity <= 0.002 || radius <= 0.5) return true;

    const viewportX = burst.pageX - scrollX;
    const viewportY = burst.pageY - scrollY;

    /* Cull bursts entirely outside the viewport so we don't issue draw calls
       for pixels nobody will see. */
    if (
      viewportX + radius < 0
      || viewportX - radius > viewportWidth
      || viewportY + radius < 0
      || viewportY - radius > viewportHeight
    ) {
      return true;
    }

    ctx.save();

    /* Optional clip keeps the bright grid lines inside the affected section. */
    const clip = burst.clipRect;
    if (clip) {
      const cl = clip.left - scrollX;
      const ct = clip.top - scrollY;
      const cw = clip.right - clip.left;
      const ch = clip.bottom - clip.top;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function' && clip.radius > 0) {
        ctx.roundRect(cl, ct, cw, ch, clip.radius);
      } else {
        ctx.rect(cl, ct, cw, ch);
      }
      ctx.clip();
    }

    /* Circular reveal — the burst's growing front. */
    ctx.beginPath();
    ctx.arc(viewportX, viewportY, radius, 0, Math.PI * 2);
    ctx.clip();

    const [r, g, b] = burst.rgb;
    const alpha = clamp(opacity * burst.intensity, 0, 1);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    const gridSize = burst.gridSize;
    const half = BURST_LINE_WIDTH / 2;

    /* Place the first vertical line just outside the left edge of the
       burst's circle, aligned to the section's grid origin. */
    const leftEdge = viewportX - radius;
    const rightEdge = viewportX + radius;
    const topEdge = viewportY - radius;
    const bottomEdge = viewportY + radius;

    const gridOriginVx = burst.gridOriginX - scrollX;
    const gridOriginVy = burst.gridOriginY - scrollY;

    const firstVerticalLine = Math.floor((leftEdge - gridOriginVx) / gridSize) * gridSize + gridOriginVx;
    for (let x = firstVerticalLine; x <= rightEdge + BURST_LINE_WIDTH; x += gridSize) {
      ctx.fillRect(x - half, topEdge, BURST_LINE_WIDTH, radius * 2);
    }

    const firstHorizontalLine = Math.floor((topEdge - gridOriginVy) / gridSize) * gridSize + gridOriginVy;
    for (let y = firstHorizontalLine; y <= bottomEdge + BURST_LINE_WIDTH; y += gridSize) {
      ctx.fillRect(leftEdge, y - half, radius * 2, BURST_LINE_WIDTH);
    }

    /* Soft press-glow that decays faster than the grid layer. */
    const glowAlpha = clamp(opacity * burst.intensity * 0.55, 0, 1);
    if (glowAlpha > 0.002) {
      const glow = ctx.createRadialGradient(viewportX, viewportY, 0, viewportX, viewportY, radius);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(glowAlpha * 0.38).toFixed(3)})`);
      glow.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${(glowAlpha * 0.14).toFixed(3)})`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(leftEdge, topEdge, radius * 2, radius * 2);
    }

    ctx.restore();
    return true;
  };

  const tick = () => {
    rafHandle = 0;
    if (!bursts.length) {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      return;
    }

    const now = windowObject.performance.now();
    const scrollX = windowObject.scrollX || 0;
    const scrollY = windowObject.scrollY || 0;

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const alive = drawBurst(bursts[i], now, scrollX, scrollY);
      if (!alive) bursts.splice(i, 1);
    }

    if (bursts.length > 0) {
      rafHandle = windowObject.requestAnimationFrame(tick);
    }
  };

  const ensureRunning = () => {
    if (!rafHandle && bursts.length > 0) {
      rafHandle = windowObject.requestAnimationFrame(tick);
    }
  };

  const addBurst = (burst) => {
    if (!burst) return;
    bursts.push({
      pageX: burst.pageX,
      pageY: burst.pageY,
      rgb: burst.rgb,
      maxRadius: burst.maxRadius,
      intensity: burst.intensity,
      gridSize: burst.gridSize,
      gridOriginX: burst.gridOriginX,
      gridOriginY: burst.gridOriginY,
      clipRect: burst.clipRect || null,
      startTime: burst.startTime
    });
    /* Cap to bound worst-case render cost; oldest goes first since that's
       the burst closest to fading out anyway. */
    while (bursts.length > MAX_ACTIVE_BURSTS) bursts.shift();
    ensureRunning();
  };

  const clear = () => {
    bursts.length = 0;
    if (rafHandle) {
      windowObject.cancelAnimationFrame(rafHandle);
      rafHandle = 0;
    }
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  };

  /* The canvas needs to follow viewport resizes (URL bar show/hide on
     mobile is a viewport resize too). Listen at the window level — cheap,
     and the rAF loop reads the latest dimensions every frame anyway. */
  const handleResize = () => {
    sizeCanvas();
    /* If we resize while bursts are running, re-render immediately so the
       visible state matches the new viewport rather than waiting for the
       next scheduled rAF. */
    if (bursts.length > 0) {
      if (rafHandle) windowObject.cancelAnimationFrame(rafHandle);
      rafHandle = windowObject.requestAnimationFrame(tick);
    }
  };

  sizeCanvas();
  windowObject.addEventListener('resize', handleResize, { passive: true });
  /* Some browsers (mobile Safari especially) finish viewport changes after
     `load`; re-measure then. */
  windowObject.addEventListener('load', handleResize);

  const destroy = () => {
    clear();
    windowObject.removeEventListener('resize', handleResize);
    windowObject.removeEventListener('load', handleResize);
  };

  return { addBurst, clear, destroy, resize: sizeCanvas };
}
