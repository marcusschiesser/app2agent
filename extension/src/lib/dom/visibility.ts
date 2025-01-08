/**
 * Check if an element is hidden by CSS properties or dimensions
 * @param element - The HTML element to check
 * @returns boolean indicating if the element is hidden
 */
export function isElementHidden(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0" ||
    element.hidden ||
    rect.width === 0 ||
    rect.height === 0
  );
}

/**
 * Checks if an element is visible within the viewport
 * @param element - The HTML element to check
 * @returns boolean indicating if the element is visible
 */
export function isVisibleInViewport(element: HTMLElement): boolean {
  if (isElementHidden(element)) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
