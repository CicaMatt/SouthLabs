import { SECTION_CURSOR_THEMES } from './sectionRegistry';
import { CARD_GRID_ANCHOR_SELECTOR } from './domSelectors';
import { clamp } from '../../lib/math';
import { getElementPageRect } from '../../lib/geometry';
import { DEFAULT_SECTION_GRID_SIZE } from './useSectionGridInteractions';

export const SECTION_CURSOR_DOT_SIZE = 20;
const SECTION_GRID_HIGHLIGHT_DISTANCE = 110;
const SECTION_GRID_HIGHLIGHT_OPACITY = 0.25;

const getSectionHighlightOpacity = (theme) =>
  theme.highlightOpacity ?? SECTION_GRID_HIGHLIGHT_OPACITY;

function readCornerRadii(element) {
  const view = element.ownerDocument?.defaultView;
  if (!view) return { tl: 0, tr: 0, br: 0, bl: 0 };
  const style = view.getComputedStyle(element);
  return {
    tl: parseFloat(style.borderTopLeftRadius) || 0,
    tr: parseFloat(style.borderTopRightRadius) || 0,
    br: parseFloat(style.borderBottomRightRadius) || 0,
    bl: parseFloat(style.borderBottomLeftRadius) || 0
  };
}

function readCardGridAnchor(cardAnchor, scrollX, scrollY, fallbackColor) {
  const view = cardAnchor.ownerDocument?.defaultView;
  const customColor =
    view?.getComputedStyle(cardAnchor).getPropertyValue('--card-grid-effect-color').trim() || '';

  return {
    color: customColor || fallbackColor,
    element: cardAnchor,
    rect: getElementPageRect(cardAnchor, scrollX, scrollY)
  };
}

export function buildSectionCursorLayout(ownerDocument) {
  const windowObject = ownerDocument.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const entries = [];

  SECTION_CURSOR_THEMES.forEach((theme) => {
    const element = ownerDocument.getElementById(theme.id);
    if (!element) return;
    const zoneElements = theme.zones
      ? Array.from(element.querySelectorAll(theme.zones.selector)).map((zoneElement) => ({
          element: zoneElement,
          radii: readCornerRadii(zoneElement),
          rect: getElementPageRect(zoneElement, scrollX, scrollY)
        }))
      : [];

    const gridSize =
      Number.parseFloat(
        windowObject?.getComputedStyle(element).getPropertyValue('--section-grid-size')
      ) || DEFAULT_SECTION_GRID_SIZE;

    entries.push({
      cardAnchors: Array.from(element.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR)).map(
        (cardAnchor) => readCardGridAnchor(cardAnchor, scrollX, scrollY, theme.color)
      ),
      color: theme.color,
      element,
      gridSize,
      highlightOpacity: theme.highlightOpacity,
      rect: getElementPageRect(element, scrollX, scrollY),
      zones: theme.zones,
      zoneElements
    });
  });

  return { entries };
}

function makeHighlight(entry, opacity = getSectionHighlightOpacity(entry)) {
  return {
    cardAnchors: entry.cardAnchors,
    color: entry.color,
    gridSize: entry.gridSize,
    opacity,
    rect: entry.rect,
    section: entry.element
  };
}

const HIDDEN_ZONE_OVERLAY = {
  zoneColor: 'transparent',
  zoneInsetTop: 100,
  zoneInsetRight: 100,
  zoneInsetBottom: 100,
  zoneInsetLeft: 100,
  zoneRadiusTopLeft: 0,
  zoneRadiusTopRight: 0,
  zoneRadiusBottomRight: 0,
  zoneRadiusBottomLeft: 0
};

function applyZoneOverlay(theme, current, pageX, pageY, dotSize) {
  const zoneConfig = current.zones;
  if (!zoneConfig) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const zoneElements = current.zoneElements;
  if (!zoneElements.length) return { ...theme, ...HIDDEN_ZONE_OVERLAY };

  const dotLeft = pageX - dotSize / 2;
  const dotRight = pageX + dotSize / 2;
  const dotTop = pageY - dotSize / 2;
  const dotBottom = pageY + dotSize / 2;

  for (const zoneElement of zoneElements) {
    const { radii, rect } = zoneElement;
    if (dotRight <= rect.left || dotLeft >= rect.right) continue;
    if (dotBottom <= rect.top || dotTop >= rect.bottom) continue;

    // How far each box edge sits inside the dot (px, can go negative once the
    // edge passes the far side of the dot). These drive both the clip insets and
    // the corner-fade below.
    const topInside = rect.top - dotTop;
    const rightInside = dotRight - rect.right;
    const bottomInside = dotBottom - rect.bottom;
    const leftInside = rect.left - dotLeft;

    const insetTop = clamp((topInside / dotSize) * 100, 0, 100);
    const insetRight = clamp((rightInside / dotSize) * 100, 0, 100);
    const insetBottom = clamp((bottomInside / dotSize) * 100, 0, 100);
    const insetLeft = clamp((leftInside / dotSize) * 100, 0, 100);
    const { tl, tr, br, bl } = radii;

    // Keep a corner at the box's true radius while it's in view, then ease it to
    // 0 over the final `r` px as the corner slides off the dot onto a side. The
    // curved part of the box edge spans exactly `r` px, so an adjacent edge that
    // has travelled past the dot by `r` means the corner has fully exited.
    const cornerFade = (edgeA, edgeB, r) =>
      r <= 0 ? 0 : Math.min(clamp((edgeA + r) / r, 0, 1), clamp((edgeB + r) / r, 0, 1));

    return {
      ...theme,
      zoneColor: zoneConfig.color,
      zoneInsetTop: insetTop,
      zoneInsetRight: insetRight,
      zoneInsetBottom: insetBottom,
      zoneInsetLeft: insetLeft,
      zoneRadiusTopLeft: tl * cornerFade(topInside, leftInside, tl),
      zoneRadiusTopRight: tr * cornerFade(topInside, rightInside, tr),
      zoneRadiusBottomRight: br * cornerFade(bottomInside, rightInside, br),
      zoneRadiusBottomLeft: bl * cornerFade(bottomInside, leftInside, bl)
    };
  }

  return { ...theme, ...HIDDEN_ZONE_OVERLAY };
}

export function getSectionCursorTheme(layout, pageX, pageY, dotSize = SECTION_CURSOR_DOT_SIZE) {
  const sectionEntries = layout?.entries ?? [];
  const currentIndex = sectionEntries.findIndex(
    ({ rect }) => pageY >= rect.top && pageY <= rect.bottom
  );

  if (currentIndex === -1) return null;

  const current = sectionEntries[currentIndex];
  const highlights = [makeHighlight(current)];

  const topBorder = current.rect.top;
  const bottomBorder = current.rect.bottom;
  const distanceFromTop = pageY - topBorder;
  const distanceFromBottom = bottomBorder - pageY;
  const dotTop = pageY - dotSize / 2;
  const dotBottom = pageY + dotSize / 2;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sectionEntries.length - 1;

  const addNeighborHighlight = (neighborIndex, distance) => {
    const neighbor = sectionEntries[neighborIndex];
    const boundaryStrength = 1 - clamp(distance / SECTION_GRID_HIGHLIGHT_DISTANCE, 0, 1);
    highlights.push(
      makeHighlight(neighbor, getSectionHighlightOpacity(neighbor) * boundaryStrength)
    );
  };

  if (hasPrevious && distanceFromTop <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    addNeighborHighlight(currentIndex - 1, distanceFromTop);
  }
  if (hasNext && distanceFromBottom <= SECTION_GRID_HIGHLIGHT_DISTANCE) {
    addNeighborHighlight(currentIndex + 1, distanceFromBottom);
  }

  // When a section border falls within the cursor dot's vertical span, the dot
  // straddles two sections: tint each half and split the fill at the border.
  const splitAt = (border) => `${clamp(((border - dotTop) / dotSize) * 100, 0, 100).toFixed(2)}%`;
  let topColor = current.color;
  let bottomColor = current.color;
  let split = '100%';

  if (hasPrevious && topBorder >= dotTop && topBorder <= dotBottom) {
    topColor = sectionEntries[currentIndex - 1].color;
    split = splitAt(topBorder);
  } else if (hasNext && bottomBorder >= dotTop && bottomBorder <= dotBottom) {
    bottomColor = sectionEntries[currentIndex + 1].color;
    split = splitAt(bottomBorder);
  }

  return applyZoneOverlay(
    { highlights, topColor, bottomColor, split },
    current,
    pageX,
    pageY,
    dotSize
  );
}
