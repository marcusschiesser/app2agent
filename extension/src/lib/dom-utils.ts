export type VisibleElementXpath = {
  index: number; // Index of the element in the parent
  element: HTMLElement; // The element itself
  xpath: string; // The xpath of the element
};

/**
 * Check if an element is hidden by CSS properties or dimensions
 * @param element - The HTML element to check
 * @returns boolean indicating if the element is hidden
 */
function isElementHidden(element: HTMLElement): boolean {
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
function isVisibleInViewport(element: HTMLElement): boolean {
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

/**
 * Highlight an element.
 * Showing a fancy border with a glow effect moving around the element.
 * @param element - The HTML element to flash
 */
export function highlightElement(element: HTMLElement) {
  // Store original styles to restore later
  const originalOutline = element.style.outline;
  const originalOutlineOffset = element.style.outlineOffset;
  const originalPosition = element.style.position;
  const originalZIndex = element.style.zIndex;

  // Set highlight styles
  element.style.outline = "2px solid #007AFF";
  element.style.outlineOffset = "2px";
  element.style.position = "relative";
  element.style.zIndex = "9999";

  // Create and add the glow effect
  const glowDiv = document.createElement("div");
  const uniqueId = `glow-${Math.random().toString(36).substr(2, 9)}`;
  glowDiv.id = uniqueId;

  // Add the glow styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes glow-${uniqueId} {
      0% { box-shadow: 0 0 10px #007AFF, 0 0 20px #007AFF; }
      50% { box-shadow: 0 0 20px #007AFF, 0 0 30px #007AFF; }
      100% { box-shadow: 0 0 10px #007AFF, 0 0 20px #007AFF; }
    }
    #${uniqueId} {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 4px;
      pointer-events: none;
      animation: glow-${uniqueId} 1.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  element.appendChild(glowDiv);

  // Remove the highlight after 3 seconds
  setTimeout(() => {
    // Restore original styles
    element.style.outline = originalOutline;
    element.style.outlineOffset = originalOutlineOffset;
    element.style.position = originalPosition;
    element.style.zIndex = originalZIndex;

    // Remove the glow effect and its styles
    glowDiv.remove();
    style.remove();
  }, 3000);
}

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
 * Generate XPath for a specific element
 * @param element - The element to generate XPath for
 * @returns The XPath expression for the element
 */
function generateXPath(element: Element): string {
  if (!element.parentElement) {
    return "//" + element.tagName.toLowerCase();
  }

  // Get all siblings of the same type
  const siblings = Array.from(element.parentElement.children).filter(
    (child) => child.tagName === element.tagName,
  );

  // If element has ID, use it
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  // If element is unique among siblings, construct simple path
  if (siblings.length === 1) {
    return (
      generateXPath(element.parentElement) + "/" + element.tagName.toLowerCase()
    );
  }

  // Find position among siblings of same type
  const index = siblings.indexOf(element) + 1;
  return (
    generateXPath(element.parentElement) +
    "/" +
    element.tagName.toLowerCase() +
    "[" +
    index +
    "]"
  );
}

/**
 * Get visible xpath for all visible elements on current page.
 * @returns Array of VisibleElementXpaths
 */
export function getVisibleElementXpaths(): VisibleElementXpath[] {
  // Get all elements in the body
  const allElements = document.body.getElementsByTagName("*");

  // Convert to array and filter for HTMLElements that are visible
  const visibleElements = Array.from(allElements)
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .filter(isVisibleInViewport);

  // Generate VisibleElementXpath for each visible element
  return visibleElements.map((element, arrayIndex) => ({
    index: arrayIndex,
    element: element,
    xpath: generateXPath(element),
  }));
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

/**
 * Get an element by XPath expression
 * @param xpath - The XPath expression to evaluate
 * @returns The first matching HTMLElement or null if not found
 */
export function getElementByXpath(xpath: string): HTMLElement | null {
  try {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );

    const element = result.singleNodeValue;
    return element instanceof HTMLElement ? element : null;
  } catch (error) {
    console.error("Invalid XPath expression:", error);
    return null;
  }
}
