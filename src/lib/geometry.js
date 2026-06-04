/* 2-D geometry helpers. Points are `{ x, y }`; rects expose left/top/right/bottom. */
import { clamp } from './math';

export function pointInRect(point, left, top, right, bottom) {
  return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

export function pointInEllipse(point, centerX, centerY, radiusX, radiusY) {
  const normalizedX = (point.x - centerX) / radiusX;
  const normalizedY = (point.y - centerY) / radiusY;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

/* Ray-casting (even-odd) point-in-polygon test. */
export function pointInPolygon(point, polygon) {
  let isInside = false;

  for (
    let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex, currentIndex += 1
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];
    const crossesY = current.y > point.y !== previous.y > point.y;
    if (!crossesY) continue;

    const intersectX =
      ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
    if (point.x < intersectX) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/* Shortest distance from a point to an axis-aligned rect (0 when inside). */
export function distancePointToRect(x, y, rect) {
  const dx = x < rect.left ? rect.left - x : Math.max(x - rect.right, 0);
  const dy = y < rect.top ? rect.top - y : Math.max(y - rect.bottom, 0);
  return Math.hypot(dx, dy);
}

export function distancePointToSegment(point, start, end) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  if (!segmentLengthSquared) return Math.hypot(point.x - start.x, point.y - start.y);

  const progress = clamp(
    ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared,
    0,
    1
  );
  const closestX = start.x + segmentX * progress;
  const closestY = start.y + segmentY * progress;

  return Math.hypot(point.x - closestX, point.y - closestY);
}

/* getBoundingClientRect translated into page coordinates. */
export function getElementPageRect(element, scrollX, scrollY) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY,
    width: rect.width,
    height: rect.height
  };
}
