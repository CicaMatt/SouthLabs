/* Thin wrappers over browser DOM/BOM APIs used across features. */

/* Write a CSS custom property only when its value actually changes, to avoid
   redundant style invalidations on hot paths. */
export function setStylePropertyIfChanged(element, propertyName, value) {
  if (element.style.getPropertyValue(propertyName) !== value) {
    element.style.setProperty(propertyName, value);
  }
}

/* High-resolution timestamp, falling back to Date.now() where unavailable. */
export function getTime(windowObject) {
  return windowObject?.performance?.now?.() ?? Date.now();
}

/* Subscribe to a MediaQueryList change, using the legacy API where needed.
   Returns an unsubscribe function. */
export function addMediaQueryChangeListener(mediaQuery, listener) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }

  mediaQuery.addListener?.(listener);
  return () => mediaQuery.removeListener?.(listener);
}

function isImageTarget(target) {
  return target instanceof HTMLElement && target.closest('img');
}

/* Suppress the native drag/context-menu default on images (used to keep the
   custom interactions feeling app-like). */
export function preventImageDefault(event) {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
}
