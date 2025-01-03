import { SchemaType, Tool } from "@google/generative-ai";
import { siteConfig } from "../site-config";

export const navigationToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "navigationTool",
      description:
        "Plan and execute navigation actions on the page with automatic refinement on failures.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          userRequest: {
            type: SchemaType.STRING,
            description:
              "The user's request to be performed (e.g., 'Change password', 'Go to settings')",
          },
          maxRetries: {
            type: SchemaType.NUMBER,
            description:
              "Maximum number of retry attempts if execution fails (default: 3)",
          },
        },
        required: ["userRequest"],
      },
    },
  ],
};

interface ExecutionResult {
  type: string;
  success: boolean;
  error?: string;
}

// Global flag to control execution
let isExecutionStopped = false;

export function stopNavigation() {
  isExecutionStopped = true;
}

export function resetNavigationState() {
  isExecutionStopped = false;
}

export const navigationTool = async ({
  userRequest,
  maxRetries = 3,
}: {
  userRequest: string;
  maxRetries?: number;
}) => {
  try {
    resetNavigationState();
    let retryCount = 0;
    let executionHistory = "";

    while (retryCount < maxRetries && !isExecutionStopped) {
      // Planning Phase
      const planResult = await createPlan(userRequest, executionHistory);
      if (!planResult.success) {
        return {
          success: false,
          error: "Failed to create navigation plan: " + planResult.error,
        };
      }

      const steps = planResult.result;
      executionHistory += `
Step: ${retryCount + 1}
Plan: ${planResult.steps}`;
      console.log("Executing navigation plan:", steps);

      // Emit initial progress
      window.postMessage(
        {
          type: "A2A_NAVIGATION_PROGRESS",
          total: steps.length,
          current: 0,
          action:
            retryCount === 0
              ? "Starting execution..."
              : "Retrying with refined plan...",
          steps: steps,
          status: "running",
        },
        window.location.origin,
      );

      // Execution Phase
      let executionFailed = false;
      let failedStep = "";
      let failedStepError = "";

      for (let i = 0; i < steps.length && !isExecutionStopped; i++) {
        const action = steps[i];
        await new Promise((resolve) => setTimeout(resolve, 300));

        // First send progress that we're starting this step
        window.postMessage(
          {
            type: "A2A_NAVIGATION_PROGRESS",
            total: steps.length,
            current: i,
            action: action,
            steps: steps,
            status: "running",
          },
          window.location.origin,
        );

        const result = await executeAction(action);
        if (!result.success) {
          executionFailed = true;
          failedStep = action;
          failedStepError = result.error || "Unknown error";

          // Send failed status
          window.postMessage(
            {
              type: "A2A_NAVIGATION_PROGRESS",
              total: steps.length,
              current: i,
              action: action,
              steps: steps,
              status: "failed",
              error: result.error,
            },
            window.location.origin,
          );

          break;
        }

        // Send progress that this step is completed
        window.postMessage(
          {
            type: "A2A_NAVIGATION_PROGRESS",
            total: steps.length,
            current: i + 1,
            action: `Completed: ${action}`,
            steps: steps,
            status: "running",
          },
          window.location.origin,
        );
      }

      if (isExecutionStopped) {
        window.postMessage(
          {
            type: "A2A_NAVIGATION_PROGRESS",
            total: steps.length,
            current: steps.findIndex((step: string) => step === failedStep),
            action: "Navigation stopped by user",
            steps: steps,
            status: "failed",
            error: "Navigation stopped by user",
          },
          window.location.origin,
        );

        return {
          success: false,
          error: "Navigation stopped by user",
        };
      }

      if (!executionFailed) {
        // Send completed status
        window.postMessage(
          {
            type: "A2A_NAVIGATION_PROGRESS",
            total: steps.length,
            current: steps.length,
            action: "Navigation completed successfully",
            steps: steps,
            status: "completed",
          },
          window.location.origin,
        );

        return {
          success: true,
          result: "Successfully executed navigation plan",
        };
      }

      // Refinement Phase
      executionHistory += `
Failed at step: ${failedStep}. Error: ${failedStepError}`;
      retryCount++;

      if (retryCount >= maxRetries) {
        window.postMessage(
          {
            type: "A2A_NAVIGATION_PROGRESS",
            total: steps.length,
            current: steps.findIndex((step: string) => step === failedStep),
            action: "Navigation failed",
            steps: steps,
            status: "failed",
            error: `Failed after ${maxRetries} attempts. Last error: ${failedStepError}`,
          },
          window.location.origin,
        );

        return {
          success: false,
          error: `Failed after ${maxRetries} attempts. Last error: ${failedStepError}`,
        };
      }
    }

    return {
      success: false,
      error: "Navigation stopped",
    };
  } catch (error) {
    console.error("Error in navigation tool:", error);
    return {
      success: false,
      error: "Error in navigation tool: " + JSON.stringify(error),
    };
  }
};

function cleanDOM(): string {
  // Get the body element
  const body = document.body;

  // Create a deep clone of body
  const clone = body.cloneNode(true) as HTMLElement;

  // Remove noisy elements
  const noisyElements = clone.querySelectorAll(
    "script, style, link, noscript, code, iframe, img, svg",
  );
  noisyElements.forEach((el) => el.remove());

  // Clean up attributes for all remaining elements
  function cleanElement(element: Element) {
    // Remove unnecessary attributes
    const attributesToKeep = ["aria-label", "value", "href", "role"];
    const attrs = Array.from(element.attributes);
    attrs.forEach((attr) => {
      if (!attributesToKeep.includes(attr.name)) {
        element.removeAttribute(attr.name);
      }
    });

    // Recursively clean child elements
    Array.from(element.children).forEach((child) => cleanElement(child));
  }

  cleanElement(clone);
  return clone.innerHTML;
}

async function executeAction(
  actionDescription: string,
): Promise<ExecutionResult> {
  if (isExecutionStopped) {
    return {
      type: "A2A_EXECUTE_ACTION_RESULT",
      success: false,
      error: "Navigation stopped by user",
    };
  }

  try {
    const dom = cleanDOM();
    console.log(
      "Executing action:",
      actionDescription,
      "DOM length:",
      dom.length,
    );

    const { success, result } = await chrome.runtime.sendMessage({
      type: "A2A_GET_DOM_SELECTOR",
      dom,
      actionDescription,
      apiKey: siteConfig.getApiKey(),
    });

    if (!success) {
      return {
        type: "A2A_EXECUTE_ACTION_RESULT",
        success: false,
        error: result,
      };
    }

    return await new Promise<ExecutionResult>((resolve) => {
      const handleExecutionResult = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data?.type === "A2A_EXECUTE_ACTION_RESULT"
        ) {
          window.removeEventListener("message", handleExecutionResult);
          resolve(event.data as ExecutionResult);
        }
      };

      window.addEventListener("message", handleExecutionResult);
      window.postMessage(
        {
          type: "A2A_EXECUTE_ACTION",
          action: result,
        },
        window.location.origin,
      );
    });
  } catch (error) {
    return {
      type: "A2A_EXECUTE_ACTION_RESULT",
      success: false,
      error: "Error executing action: " + JSON.stringify(error),
    };
  }
}

async function getScreenshot(): Promise<string> {
  try {
    return await new Promise<string>((resolve) => {
      const handleScreenshotResult = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data?.type === "A2A_SCREENSHOT_RESULT"
        ) {
          window.removeEventListener("message", handleScreenshotResult);
          resolve(event.data.screenshot || "");
        }
      };

      window.addEventListener("message", handleScreenshotResult);
      window.postMessage(
        {
          type: "A2A_GET_SCREENSHOT",
        },
        window.location.origin,
      );
    });
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    return "";
  }
}

async function createPlan(userRequest: string, executionHistory: string = "") {
  const currentUrl = window.location.href;
  const screenshot = await getScreenshot();
  const result = await chrome.runtime.sendMessage({
    type: "A2A_CREATE_NAVIGATION_PLAN",
    userRequest,
    currentUrl,
    executionHistory,
    screenshot,
    apiKey: siteConfig.getApiKey(),
    manual: siteConfig.getSiteContext(),
  });

  return result;
}
