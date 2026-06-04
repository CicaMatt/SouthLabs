import { HERO_GRAPHIC_CURSOR_SMALL_CLASS, HERO_GRAPHIC_SELECTOR } from './domSelectors';
import {
  distancePointToSegment,
  pointInEllipse,
  pointInPolygon,
  pointInRect
} from '../../lib/geometry';
import {
  FACTORY_BASE_STRIP,
  FACTORY_BODY_POLYGON as FACTORY_BODY_POINTS,
  FACTORY_VIEWBOX,
  PIPE_BODY_POLYGON as PIPE_BODY_POINTS
} from '../hero/factoryGeometry';

// The shared factory geometry is stored as [x, y] arrays; the hit test works
// in { x, y } points, so adapt once at module load.
const toPoint = ([x, y]) => ({ x, y });
const FACTORY_BODY_POLYGON = FACTORY_BODY_POINTS.map(toPoint);
const PIPE_BODY_POLYGON = PIPE_BODY_POINTS.map(toPoint);
const PIPE_TO_CLOUD_START = { x: 271, y: 166 };
const PIPE_TO_CLOUD_END = { x: 271, y: 210 };
const PIPE_TO_CLOUD_MAX_DISTANCE = 12;

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

  const pipeToCloudDistance = distancePointToSegment(point, PIPE_TO_CLOUD_START, PIPE_TO_CLOUD_END);

  return (
    pointInPolygon(point, FACTORY_BODY_POLYGON) ||
    pointInRect(
      point,
      FACTORY_BASE_STRIP.left,
      FACTORY_BASE_STRIP.top,
      FACTORY_BASE_STRIP.right,
      FACTORY_BASE_STRIP.bottom
    ) ||
    pointInPolygon(point, PIPE_BODY_POLYGON) ||
    pipeToCloudDistance <= PIPE_TO_CLOUD_MAX_DISTANCE ||
    pointInEllipse(point, 300, 102, 148, 88) ||
    pointInRect(point, 190, 92, 410, 170)
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
      : FACTORY_VIEWBOX;

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
