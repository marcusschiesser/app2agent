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
