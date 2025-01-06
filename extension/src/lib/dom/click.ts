import { isElementHidden } from "./visibility";

/**
 * Check if an element is interactible (clickable)
 * @param element - The HTML element to check
 * @returns boolean indicating if the element is interactible
 */
export function isInteractible(element: HTMLElement): boolean {
  if (isElementHidden(element)) {
    return false;
  }

  // Check if element is disabled
  if (
    element instanceof HTMLButtonElement ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    if (element.disabled) {
      return false;
    }
  }

  // Check if element or its ancestors have pointer-events: none
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    const pointerEvents = window.getComputedStyle(currentElement).pointerEvents;
    if (pointerEvents === "none") {
      return false;
    }
    currentElement = currentElement.parentElement;
  }

  // Check if element is clickable by nature
  const clickableElements = [
    "A",
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "SUMMARY",
    "VIDEO",
    "AUDIO",
  ];

  if (clickableElements.includes(element.tagName)) {
    return true;
  }

  // Check for click-related attributes
  const style = window.getComputedStyle(element);
  if (
    element.hasAttribute("onclick") ||
    (element.hasAttribute("role") &&
      ["button", "link", "menuitem"].includes(
        element.getAttribute("role") || "",
      )) ||
    element.hasAttribute("tabindex") ||
    style.cursor === "pointer"
  ) {
    return true;
  }

  return false;
}

/**
 * Simulate a click on an element by recursively checking for interactible elements
 * @param element - The element to click
 * @returns boolean - Whether a click was successfully simulated
 */
export function simulateClick(element: HTMLElement): boolean {
  // First check if the element itself is interactible
  if (isInteractible(element)) {
    element.click();
    return true;
  }

  // Recursively check all child elements
  for (const child of element.children) {
    if (child instanceof HTMLElement) {
      if (simulateClick(child)) {
        return true;
      }
    }
  }

  return false;
}
