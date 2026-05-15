import { SECTION_GRID_SIZE, CARD_GRID_ANCHOR_SELECTOR } from './constants';

function setStylePropertyIfChanged(element, propertyName, value) {
  if (element.style.getPropertyValue(propertyName) !== value) {
    element.style.setProperty(propertyName, value);
  }
}

export function clearCardGridHighlight(card) {
  setStylePropertyIfChanged(card, '--card-grid-highlight-opacity', '0');
}

export function updateCardGridHighlight(card, clientX, clientY, color, opacity) {
  const cardRect = card.getBoundingClientRect();

  card.style.setProperty('--card-grid-highlight-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--card-grid-highlight-y', `${(clientY - cardRect.top).toFixed(2)}px`);
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
    const currentAdjustment = Number.parseFloat(
      section.style.getPropertyValue('--section-grid-snap-padding')
    ) || 0;
    const gridSize = Number.parseFloat(
      getComputedStyle(section).getPropertyValue('--section-grid-size')
    ) || SECTION_GRID_SIZE;
    const baseTop = rect.top + scrollY - currentAdjustmentBefore + desiredAdjustmentBefore;
    const baseHeight = rect.height - currentAdjustment;
    const unsnappedBottom = baseTop + baseHeight;
    const bottomRemainder = ((unsnappedBottom % gridSize) + gridSize) % gridSize;
    const desiredAdjustment = bottomRemainder < 0.5
      ? 0
      : gridSize - bottomRemainder;

    setStylePropertyIfChanged(section, '--section-grid-origin-x', `${(rect.left + scrollX).toFixed(2)}px`);
    setStylePropertyIfChanged(section, '--section-grid-origin-y', `${baseTop.toFixed(2)}px`);
    setStylePropertyIfChanged(section, '--section-grid-snap-padding', `${desiredAdjustment.toFixed(2)}px`);

    section.querySelectorAll(CARD_GRID_ANCHOR_SELECTOR).forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      setStylePropertyIfChanged(element, '--card-grid-origin-x', `${(elementRect.left + scrollX).toFixed(2)}px`);
      setStylePropertyIfChanged(element, '--card-grid-origin-y', `${(baseTop + elementRect.top - rect.top).toFixed(2)}px`);
    });

    currentAdjustmentBefore += currentAdjustment;
    desiredAdjustmentBefore += desiredAdjustment;
  });
}
