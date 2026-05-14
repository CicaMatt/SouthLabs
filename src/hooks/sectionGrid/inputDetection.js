import { MOUSE_WHEEL_ZOOM_MIN_DELTA } from './constants';

export function getTime(windowObject) {
  return windowObject?.performance?.now?.() ?? Date.now();
}

function isImageTarget(target) {
  return target instanceof HTMLElement && target.closest('img');
}

export function preventImageDefault(event) {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
}

export function isDesktopChromium(windowObject) {
  const navigatorObject = windowObject.navigator;
  const userAgent = navigatorObject.userAgent || '';
  const brands = navigatorObject.userAgentData?.brands?.map(({ brand }) => brand).join(' ') || '';
  const hasFinePointer = windowObject.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = (
    navigatorObject.userAgentData?.mobile
    || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
  );
  const isChromium = (
    /\b(Chromium|Google Chrome|Chrome)\b/i.test(brands)
    || /\b(Chrome|Chromium)\//i.test(userAgent)
  );
  const isExcludedChromiumShell = /\b(Edg|OPR|Opera|SamsungBrowser|CriOS)\//i.test(userAgent);

  return hasFinePointer && !isMobile && isChromium && !isExcludedChromiumShell;
}

export function isLikelyDesktopTrackpadPinch(event, windowObject) {
  if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;

  const wheelEvent = windowObject.WheelEvent;
  if (wheelEvent && event.deltaMode !== wheelEvent.DOM_DELTA_PIXEL) return false;

  const delta = Math.max(
    Math.abs(event.deltaX || 0),
    Math.abs(event.deltaY || 0),
    Math.abs(event.deltaZ || 0)
  );
  if (!delta) return false;

  const wheelDeltaY = Math.abs(event.wheelDeltaY || 0);
  const looksLikeSteppedMouseWheel = (
    wheelDeltaY >= 120
    && wheelDeltaY % 120 === 0
    && delta >= MOUSE_WHEEL_ZOOM_MIN_DELTA
  );

  return !looksLikeSteppedMouseWheel;
}
