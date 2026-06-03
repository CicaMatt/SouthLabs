import { CARD_GRID_ANCHOR_SELECTOR } from './selectors';

const SECTION_GRID_SIZE = 72;

/* Threshold under which an origin rewrite is treated as noise. Any sub-pixel
   change in section/card layout (font loading, image weight settling, async
   content slot-in) used to retrigger the grid `background-position` transitions
   across every section — that cascading shift is what reads as flicker. */
const ORIGIN_REWRITE_EPSILON_PX = 1;

export function setStylePropertyIfChanged(element, propertyName, value) {
  if (element.style.getPropertyValue(propertyName) !== value) {
    element.style.setProperty(propertyName, value);
  }
}

function setPxStylePropertyIfMeaningfullyChanged(element, propertyName, nextPxValue) {
  const previousRaw = element.style.getPropertyValue(propertyName);
  if (previousRaw) {
    const previousNumeric = Number.parseFloat(previousRaw);
    if (
      Number.isFinite(previousNumeric) &&
      Math.abs(previousNumeric - nextPxValue) < ORIGIN_REWRITE_EPSILON_PX
    ) {
      return;
    }
  }
  element.style.setProperty(propertyName, `${nextPxValue.toFixed(2)}px`);
}

export function clearCardGridHighlight(card) {
  setStylePropertyIfChanged(card, '--card-grid-highlight-opacity', '0');
}

export function updateCardGridHighlight(
  card,
  pointerX,
  pointerY,
  color,
  opacity,
  cardRect = card.getBoundingClientRect()
) {
  card.style.setProperty('--card-grid-highlight-x', `${(pointerX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--card-grid-highlight-y', `${(pointerY - cardRect.top).toFixed(2)}px`);
  setStylePropertyIfChanged(card, '--card-grid-highlight-color', color);
  card.style.setProperty('--card-grid-highlight-opacity', opacity.toFixed(3));
}

export function syncSectionGridOrigins(mainElement) {
  const windowObject = mainElement.ownerDocument.defaultView;
  const scrollX = windowObject?.scrollX || 0;
  const scrollY = windowObject?.scrollY || 0;
  const sections = Array.from(mainElement.querySelectorAll(':scope > section'));
  let currentAdjustmentBefore = 0;
  let desiredAdjustmentBefore = 0;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const currentAdjustment =
      Number.parseFloat(section.style.getPropertyValue('--section-grid-snap-padding')) || 0;
    const gridSize =
      Number.parseFloat(getComputedStyle(section).getPropertyValue('--section-grid-size')) ||
      SECTION_GRID_SIZE;
    const baseTop = rect.top + scrollY - currentAdjustmentBefore + desiredAdjustmentBefore;
    const baseHeight = rect.height - currentAdjustment;
    const unsnappedBottom = baseTop + baseHeight;
    const bottomRemainder = ((unsnappedBottom % gridSize) + gridSize) % gridSize;
    const desiredAdjustment = bottomRemainder < 0.5 ? 0 : gridSize - bottomRemainder;

    setPxStylePropertyIfMeaningfullyChanged(
      section,
      '--section-grid-origin-x',
      rect.left + scrollX
    );
    setPxStylePropertyIfMeaningfullyChanged(section, '--section-grid-origin-y', baseTop);
    setStylePropertyIfChanged(
      section,
      '--section-grid-snap-padding',
      `${desiredAdjustment.toFixed(2)}px`
    );

    section.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR).forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      setPxStylePropertyIfMeaningfullyChanged(
        element,
        '--card-grid-origin-x',
        elementRect.left + scrollX
      );
      setPxStylePropertyIfMeaningfullyChanged(
        element,
        '--card-grid-origin-y',
        baseTop + elementRect.top - rect.top
      );
    });

    currentAdjustmentBefore += currentAdjustment;
    desiredAdjustmentBefore += desiredAdjustment;
  });
}
