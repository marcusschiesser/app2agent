import { SchemaType, Tool } from "@google/generative-ai";

interface ExecutionResult {
  type: string;
  success: boolean;
  error?: string;
}

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

  return clone.innerHTML;
}

export const navigateTool = async ({
  actionDescription,
}: {
  actionDescription: string;
}) => {
  try {
    // Get cleaned DOM
    const dom = cleanDOM();

    // Use our existing system to create action plan
    console.log("Getting dom selector for action:", actionDescription);
    const { success, result } = await chrome.runtime.sendMessage({
      type: "A2A_GET_DOM_SELECTOR",
      dom,
      actionDescription,
    });

    if (!success) {
      console.error("Failed to create dom selector:", result);
      return { success: false, error: result };
    }
    console.log("Executing action:", result);
    // Create a promise that resolves when the execution is complete
    const executionResult = await new Promise<ExecutionResult>((resolve) => {
      // Listen for the execution result
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

      // Send the execution message
      window.postMessage(
        {
          type: "A2A_EXECUTE_ACTION",
          action: result,
        },
        window.location.origin,
      );
    });

    // Check the execution result
    if (!executionResult.success) {
      return {
        success: false,
        error: `Navigation failed: ${executionResult.error}`,
      };
    }

    return { success: true, result: "Navigation successful" };
  } catch (error) {
    console.error("Error executing action:", error);
    return {
      success: false,
      error: "Error executing navigation: " + JSON.stringify(error),
    };
  }
};

export const navigationToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "navigateTool",
      description: "Navigate or perform actions on the page.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          actionDescription: {
            type: SchemaType.STRING,
            description:
              "Description of what to do, e.g. 'Click the Settings button' or 'Fill in the email field with test@example.com'",
          },
        },
        required: ["actionDescription"],
      },
    },
  ],
};
