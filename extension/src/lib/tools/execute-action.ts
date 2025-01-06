import { getVisibleElementXpaths, VisibleElementXpath } from "../dom/xpath";
import { highlightElement } from "../dom/highlight";
import { getElementByXpath } from "../dom/xpath";
import { simulateClick } from "../dom/click";
import { getLLMResponse } from "../llm";
import { SiteConfig } from "@/hooks/use-config";
import { updateActionStatus } from "../events";

/**
 * Clean up text content by removing extra whitespace and newlines
 * @param text - The text to clean
 * @returns Cleaned text
 */
function cleanTextContent(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Format the visible element xpaths for the LLM
 * E.g:
 * [0]: //*[@id="login"]/div/button - Login
 * [1]: //*[@id="settings"]/div/li/a - Settings
 * [2]: //*[@id="logout"]/div/button - Logout
 * @param visibleElementXpaths - The visible element xpaths to format
 * @returns The formatted visible element xpaths
 */
const formatVisibleElementXpaths = (
  visibleElementXpaths: VisibleElementXpath[],
) => {
  return visibleElementXpaths
    .map((element, index) => {
      const el = element.element;
      const ariaLabel = el.getAttribute("aria-label") || "";
      const role = el.getAttribute("role") || "";
      const text = cleanTextContent(el.textContent);
      const description =
        [ariaLabel, role, text].filter(Boolean).join(" - ") || "Empty element";

      return `[${index}]: ${element.xpath} - ${description}`;
    })
    .join("\n");
};

/**
 * Execute an action on the current page. Required siteConfig to get the API key.
 * @param userRequest - The user's request to be performed (e.g., 'Change password', 'Go to settings')
 * @param click (optional) - Whether to click the element after finding it. Default is true.
 * @param siteConfig - The site configuration to get the API key.
 * @param model (optional) - The model to use for the LLM. Default is gemini-1.5-flash which is enough for this task and to avoid rate limit issues.
 * @returns The element that matches the user request
 */
export async function executeActionTool({
  userRequest,
  click = true,
  siteConfig,
  model = "models/gemini-1.5-flash",
}: {
  userRequest: string;
  click?: boolean;
  siteConfig: SiteConfig;
  model?: string;
}): Promise<{ success: boolean; result: VisibleElementXpath | string }> {
  // Construct a prompt of all visible elements with their xpath.
  updateActionStatus({
    message: `Executing: ${userRequest}`,
    status: "running",
  });
  const visibleElementXpaths = getVisibleElementXpaths();

  const elementsPrompt = formatVisibleElementXpaths(visibleElementXpaths);

  const prompt = `You are a browser agent who is using a browser to perform actions on a website.
  You are given a list of visible elements on the current page. Each element is described by its xpath and text content.
  Based on the provided context, find an element that matches the user request.
  Respond with only the index of the element that matches the user request, without any other text. If no element matches the user request, respond with -1.
  The elements follow this pattern: [index]: description

  E.g:
  ###elements
  [0]: Login
  [1]: Settings
  [2]: Logout
  ###

  User request: "Go to settings"
  Answer: 2
  

  Here is the provided information:
  ###elements
  ${elementsPrompt}
  ###

  User request: ${userRequest}

  Now, your answer is:
  `;

  const response = await getLLMResponse(
    siteConfig.apiKey,
    prompt,
    false, // includeScreenshot
    model,
  );
  const index = parseInt(response.text().trim());
  const element = visibleElementXpaths[index];
  if (index === -1) {
    return {
      success: false,
      result: `No element found for "${userRequest}"`,
    };
  }
  const elementElement = getElementByXpath(element.xpath);
  if (elementElement) {
    // Highlight the element
    highlightElement(elementElement);
    // Click the element if click is true
    if (click) {
      try {
        simulateClick(elementElement);
        updateActionStatus({
          message: `Executed: ${userRequest}`,
          status: "completed",
        });
      } catch (error) {
        updateActionStatus({
          message: `Error: ${JSON.stringify(error)}`,
          status: "failed",
        });
        return {
          success: false,
          result: `Found element but failed to click: ${JSON.stringify(error)}`,
        };
      }
    }
  }

  return {
    success: true,
    result: `Clicked on ${element.xpath} successfully`,
  };
}
