import { SECTION_GRID_SIZE, SITE_GRID_THROUGH_SELECTOR } from './constants';

function setStylePropertyIfChanged(element, propertyName, value) {
  if (element.style.getPropertyValue(propertyName) !== value) {
    element.style.setProperty(propertyName, value);
  }
}

export function clearGridThroughCardHighlight(card) {
  setStylePropertyIfChanged(card, '--site-grid-through-highlight-opacity', '0');
}

export function updateGridThroughCardHighlight(card, clientX, clientY, color, opacity) {
  const cardRect = card.getBoundingClientRect();

  card.style.setProperty('--site-grid-through-highlight-x', `${(clientX - cardRect.left).toFixed(2)}px`);
  card.style.setProperty('--site-grid-through-highlight-y', `${(clientY - cardRect.top).toFixed(2)}px`);
  setStylePropertyIfChanged(card, '--site-grid-through-highlight-color', color);
  card.style.setProperty('--site-grid-through-highlight-opacity', opacity.toFixed(3));
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
    const baseTop = rect.top + scrollY - currentAdjustmentBefore + desiredAdjustmentBefore;
    const baseHeight = rect.height - currentAdjustment;
    const unsnappedBottom = baseTop + baseHeight;
    const bottomRemainder = ((unsnappedBottom % SECTION_GRID_SIZE) + SECTION_GRID_SIZE) % SECTION_GRID_SIZE;
    const desiredAdjustment = bottomRemainder < 0.5
      ? 0
      : SECTION_GRID_SIZE - bottomRemainder;

    setStylePropertyIfChanged(section, '--section-grid-origin-x', `${(rect.left + scrollX).toFixed(2)}px`);
    setStylePropertyIfChanged(section, '--section-grid-origin-y', `${baseTop.toFixed(2)}px`);
    setStylePropertyIfChanged(section, '--section-grid-snap-padding', `${desiredAdjustment.toFixed(2)}px`);

    section.querySelectorAll(SITE_GRID_THROUGH_SELECTOR).forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      setStylePropertyIfChanged(element, '--site-grid-through-origin-x', `${(elementRect.left + scrollX).toFixed(2)}px`);
      setStylePropertyIfChanged(element, '--site-grid-through-origin-y', `${(baseTop + elementRect.top - rect.top).toFixed(2)}px`);
    });

    currentAdjustmentBefore += currentAdjustment;
    desiredAdjustmentBefore += desiredAdjustment;
  });
}
