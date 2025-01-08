import { isVisibleInViewport } from "./visibility";

export type VisibleElementXpath = {
  index: number; // Index of the element in the parent
  element: HTMLElement; // The element itself
  xpath: string; // The xpath of the element
};

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
