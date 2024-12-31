import { Tool } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai";
import { navigateTool } from "./navigation-tool";

export const createNavigationPlanToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "createNavigationPlanTool",
      description: "Create a navigation plan for a user's request",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          userRequest: {
            type: SchemaType.STRING,
            description: "The user's request to be performed",
          },
          previousExecution: {
            type: SchemaType.STRING,
            description:
              "Describe the previous execution if there is one, otherwise leave it empty. E.g: Clicked the Settings button but failed at clicking the Save button.",
          },
        },
        required: ["userRequest", "previousExecution"],
      },
    },
  ],
};

export const createNavigationPlanTool = async ({
  userRequest,
  previousExecution,
}: {
  userRequest: string;
  previousExecution: string;
}) => {
  const currentUrl = window.location.href;

  const actionPlan = await chrome.runtime.sendMessage({
    type: "A2A_CREATE_NAVIGATION_PLAN",
    userRequest,
    currentUrl,
    previousExecution,
  });

  console.log("Received action plan:", actionPlan);
  return actionPlan;
};

export const executeNavigationPlanToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "executeNavigationPlanTool",
      description: "Execute a navigation plan for a user's request",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          navigationPlan: {
            type: SchemaType.ARRAY,
            description: "A list of actions to be performed",
            items: {
              type: SchemaType.STRING,
              description: "An action to be performed",
            },
          },
        },
        required: ["navigationPlan"],
      },
    },
  ],
};

/**
 * A loop on executing the navigation plan
 */
export const executeNavigationPlanTool = async ({
  navigationPlan,
}: {
  navigationPlan: string[];
}) => {
  console.log("Executing navigation plan:", navigationPlan);

  // Emit initial progress
  window.postMessage(
    {
      type: "A2A_NAVIGATION_PROGRESS",
      total: navigationPlan.length,
      current: 0,
      action: "Starting execution...",
    },
    window.location.origin,
  );

  for (let i = 0; i < navigationPlan.length; i++) {
    const action = navigationPlan[i];
    // Wait for the page is ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Emit progress before executing step
    window.postMessage(
      {
        type: "A2A_NAVIGATION_PROGRESS",
        total: navigationPlan.length,
        current: i + 1,
        action: action,
      },
      window.location.origin,
    );

    const stepResult = await navigateTool({ actionDescription: action });
    if (!stepResult.success) {
      return {
        success: false,
        error: stepResult.error,
      };
    }
  }

  return {
    success: true,
    result: "Successfully executed navigation plan",
  };
};
