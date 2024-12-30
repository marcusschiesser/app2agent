import { SchemaType, Tool } from "@google/generative-ai";

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

    // Execute the action using our page navigation
    window.postMessage(
      {
        type: "A2A_EXECUTE_PLAN",
        action: result,
      },
      window.location.origin,
    );

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
