import { HERO_GRAPHIC_CURSOR_SMALL_CLASS, HERO_GRAPHIC_SELECTOR } from './domSelectors';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FACTORY_BODY_POLYGON = [
  { x: 126, y: 500 },
  { x: 126, y: 391 },
  { x: 380, y: 264 },
  { x: 494, y: 337 },
  { x: 494, y: 500 }
];
const PIPE_BODY_POLYGON = [
  { x: 236, y: 336 },
  { x: 252, y: 210 },
  { x: 290, y: 210 },
  { x: 306, y: 301 }
];
const PIPE_TO_CLOUD_START = { x: 271, y: 166 };
const PIPE_TO_CLOUD_END = { x: 271, y: 210 };
const PIPE_TO_CLOUD_MAX_DISTANCE = 12;
const FALLBACK_VIEWBOX = { x: 0, y: 0, width: 600, height: 540 };

function isPointInRect(point, left, top, right, bottom) {
  return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

function isPointInEllipse(point, centerX, centerY, radiusX, radiusY) {
  const normalizedX = (point.x - centerX) / radiusX;
  const normalizedY = (point.y - centerY) / radiusY;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
}

function isPointInPolygon(point, polygon) {
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

function getPointToSegmentDistance(point, start, end) {
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

function getSvgPointForPagePoint(layout, pageX, pageY) {
  const { pageRect, viewBox } = layout;
  return {
    x: viewBox.x + ((pageX - pageRect.left) / pageRect.width) * viewBox.width,
    y: viewBox.y + ((pageY - pageRect.top) / pageRect.height) * viewBox.height
  };
}

function isPointInHeroGraphic(layout, pageX, pageY) {
  const { pageRect } = layout;
  if (
    pageX < pageRect.left ||
    pageX > pageRect.right ||
    pageY < pageRect.top ||
    pageY > pageRect.bottom
  ) {
    return false;
  }

  const point = getSvgPointForPagePoint(layout, pageX, pageY);

  const pipeToCloudDistance = getPointToSegmentDistance(
    point,
    PIPE_TO_CLOUD_START,
    PIPE_TO_CLOUD_END
  );

  return (
    isPointInPolygon(point, FACTORY_BODY_POLYGON) ||
    isPointInRect(point, 76, 500, 544, 520) ||
    isPointInPolygon(point, PIPE_BODY_POLYGON) ||
    pipeToCloudDistance <= PIPE_TO_CLOUD_MAX_DISTANCE ||
    isPointInEllipse(point, 300, 102, 148, 88) ||
    isPointInRect(point, 190, 92, 410, 170)
  );
}

export function readHeroGraphicCursorLayout(mainElement) {
  const heroGraphic = mainElement.querySelector(HERO_GRAPHIC_SELECTOR);
  if (!heroGraphic) return null;

  const windowObject = mainElement.ownerDocument.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const rect = heroGraphic.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const viewBox = heroGraphic.viewBox?.baseVal;
  const resolvedViewBox =
    viewBox && viewBox.width > 0 && viewBox.height > 0
      ? { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height }
      : FALLBACK_VIEWBOX;

  return {
    pageRect: {
      left: rect.left + scrollX,
      top: rect.top + scrollY,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY,
      width: rect.width,
      height: rect.height
    },
    viewBox: resolvedViewBox
  };
}

export function updateHeroGraphicCursorState(mainElement, heroGraphicLayout, pageX, pageY) {
  if (!heroGraphicLayout) {
    mainElement.classList.remove(HERO_GRAPHIC_CURSOR_SMALL_CLASS);
    return false;
  }

  const isOverGraphic = isPointInHeroGraphic(heroGraphicLayout, pageX, pageY);
  mainElement.classList.toggle(HERO_GRAPHIC_CURSOR_SMALL_CLASS, isOverGraphic);
  return isOverGraphic;
}
