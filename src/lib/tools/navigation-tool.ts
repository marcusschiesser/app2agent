import { SchemaType, Tool } from "@google/generative-ai";

interface ExecutionResult {
  type: string;
  success: boolean;
  error?: string;
}

export const navigateTool = async ({
  actionDescription,
}: {
  actionDescription: string;
}) => {
  try {
    // Get current DOM
    const dom = document.documentElement.outerHTML;

    // Use our existing system to create action plan
    console.log("Sending message to get action plan");
    const { success, result } = await chrome.runtime.sendMessage({
      type: "A2A_GET_ACTION_PLAN",
      dom,
      actionDescription,
    });

    console.log("Received action plan:", result);
    if (!success) {
      console.error("Failed to create action plan:", result);
      return { success: false, error: result };
    }

    console.log("Sending message to execute action plan");

    // Create a promise that resolves when the execution is complete
    const executionResult = await new Promise<ExecutionResult>((resolve) => {
      // Listen for the execution result
      const handleExecutionResult = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data?.type === "A2A_EXECUTE_PLAN_RESULT"
        ) {
          window.removeEventListener("message", handleExecutionResult);
          resolve(event.data as ExecutionResult);
        }
      };

      window.addEventListener("message", handleExecutionResult);

      // Send the execution message
      window.postMessage(
        {
          type: "A2A_EXECUTE_PLAN",
          action: result,
        },
        window.location.origin,
      );
    });

    // Check the execution result
    console.log("Execution result:", executionResult);
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
      description:
        "Navigate or perform actions on the page. It'd take a while for doing an action",
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
