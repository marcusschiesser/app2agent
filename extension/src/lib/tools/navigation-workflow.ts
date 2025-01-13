import { SchemaType, Tool } from "@google/generative-ai";
import { executeActionTool } from "./execute-action";
import { cleanLLMResponse, getLLMResponse } from "../llm";
import { SiteConfig } from "@/lib/config";
import { EVENT_TYPE, updateActionStatus } from "../events";

const MODEL = "models/gemini-2.0-flash-exp"; // For reasoning the next action

type ExecutionState = "pending" | "in_progress" | "completed" | "failed";

interface Action {
  action: string; // The action to be performed
  explanation?: string; // The explanation for the action, provide more context to the LLM for reasoning the next action
  status: ExecutionState;
  result?: string;
  error?: string;
}

class NavigationWorkflow {
  private executionHistory: Action[] = [];
  private userRequest: string;
  private shouldStop: boolean = false;
  private siteConfig: SiteConfig;

  constructor(userRequest: string, siteConfig: SiteConfig) {
    this.userRequest = userRequest;
    this.siteConfig = siteConfig;
    this.setupStopListener();
  }

  private setupStopListener() {
    const handleStop = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === EVENT_TYPE.STOP_NAVIGATION
      ) {
        console.log("Received stop signal");
        this.shouldStop = true;
      }
    };

    window.addEventListener("message", handleStop);
  }

  private formatAction(action: Action, index: number): string {
    return `\n[${index + 1}]\nAction: ${action.action}\nExplanation: ${action.explanation}\nResult: ${JSON.stringify(action.result) || JSON.stringify(action.status)}\n`;
  }

  // Get next action from LLM
  private async predictNextStep(): Promise<Action> {
    updateActionStatus({
      message: "Thinking...",
      status: "running",
    });
    const executionHistory = this.executionHistory
      .map((a) => this.formatAction(a, this.executionHistory.indexOf(a)))
      .join("\n");
    console.log("Execution history:", executionHistory);
    const prompt = `
You are an IT support agent. Who know well about the website and can help user to do something on the website.
You are only allowed to make actions on the website. Stop making actions if the website needs another action like scroll, select, input, toggle, etc.
Based on the current state of the website (from the provided image), explain what the user should do next to achieve their goal or you cannot make any action.
Response in JSON format with the following schema:
{
  "action": "The action to be performed",
  "explanation": "The explanation for the action"
}
If you can't determine what to do next, respond with null action:
{
  "action": null,
  "explanation": "The reason why you can't determine what to do next"
}
If the user's goal is already achieved, respond with null action:
{
  "action": null,
  "explanation": "The goal is already achieved"
}

IMPORTANT:
- The provided screenshot is the important information to determine the next action. Avoid making up actions that are not present in the screenshot.
- Based on the execution history, avoid repeating the same action that has already been done.
- If the action related to element has state like checkbox, select, dropdown, etc. then always use the current state of the element to determine the next action.
- Always respond in JSON format.
- Always refer to the user as "you" instead of "the user".

Example:
User request: "I want to buy a new laptop"
Screenshot context: "The screenshot shows a shopping website but the user is on the home page. There is a 'Shop' link on the top right corner of the page."
Previous actions: "Empty"
Your answer: 
{
  "action": "Click on the 'Shop' link",
  "explanation": "You are on the home page and the goal is to buy a new laptop. The 'Shop' link is on the top right corner of the page."
}

User request: "I want to buy a new laptop"
Screenshot context: "The screenshot shows a shopping website and a Shop tabs is active and there are some laptops listed."
Previous actions: "Click on the 'Shop' link"
Your answer: 
{
  "action": null,
  "explanation": "The goal is already achieved"
}

Check if these information is useful to determine the next action:
${this.siteConfig.manual}

Here is what has been done so far:
${executionHistory}

The user request is: ${this.userRequest}

What should be the next action?
`;

    const result = await getLLMResponse(
      this.siteConfig.apiKey,
      prompt,
      true, // includeScreenshot
      MODEL,
    );
    const nextAction = JSON.parse(cleanLLMResponse(result.text()));
    return {
      action: nextAction.action,
      explanation: nextAction.explanation,
      status: "pending",
    };
  }

  private async executeStep(step: Action): Promise<void> {
    step.status = "in_progress";
    const result = await executeActionTool({
      userRequest: step.action,
      click: true,
      siteConfig: this.siteConfig,
    });

    if (!result.success) {
      throw new Error(result.result.toString());
    }

    step.result = result.result.toString();
    step.status = "completed";
  }

  // Execute the navigation workflow
  // We set the retries on navigation workflow to help the LLM to reason the failed action
  // then retry it, perform other actions or stop the workflow.
  // @param maxRetries (optional) - The maximum number of retries to execute the action. Default is 3.
  async execute(
    maxRetries: number = 3,
  ): Promise<{ success: boolean; details: string }> {
    try {
      let retries = 0;
      while (!this.shouldStop && retries < maxRetries) {
        // 1. Predict next step
        const step = await this.predictNextStep();

        // 2. Return if prediction error or no more actions
        if (!step.action) {
          updateActionStatus({
            message: "Completed",
            status: "completed",
          });
          return {
            success: true,
            details: "Completed: No more actions to perform",
          };
        }

        // 3. Execute the step
        try {
          await this.executeStep(step);
          this.executionHistory.push(step);
        } catch (error) {
          // 4. Update step error and status
          step.status = "failed";
          step.error = error instanceof Error ? error.message : "Unknown error";
          this.executionHistory.push(step);
          retries++;
          continue;
        }
        // Wait before next iteration to:
        // 1. Avoid rate limit issues
        // 2. Wait for the page to load
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 5. Handle workflow stop
      if (this.shouldStop) {
        updateActionStatus({
          message: "Workflow stopped by user",
          status: "failed",
        });
        return {
          success: true,
          details: "Workflow stopped by user",
        };
      }

      // Handle max retries exceeded
      updateActionStatus({
        message: "Maximum retries exceeded",
        status: "failed",
      });
      return {
        success: false,
        details: "Maximum retries exceeded",
      };
    } catch (error) {
      console.error("Navigation workflow failed:", JSON.stringify(error));
      updateActionStatus({
        message: "Workflow failed",
        status: "failed",
      });
      return {
        success: false,
        details: "Workflow failed: " + JSON.stringify(error),
      };
    }
  }

  // To give the caller LLM a report of how the workflow is executed
  // Could be helpful for notifying to the user
  generateReport(isSuccess: boolean, message: string): string {
    if (this.executionHistory.length === 0) {
      return "No actions executed. It's already done.";
    }

    let report = `Request: ${this.userRequest}\n\nActions:\n`;
    this.executionHistory.forEach((step, index) => {
      report += `${index + 1}. "${step.action}": ${step.status}`;
      if (step.error) report += ` (Error: ${step.error})`;
      if (step.result) report += ` (${step.result})`;
      report += "\n";
    });

    if (isSuccess) {
      report += `\nStatus: Completed.\n${message}`;
    } else {
      report += `\nStatus: Failed.\n${message}`;
    }

    return report;
  }
}

export const navigationWorkflow = async ({
  userRequest,
  siteConfig,
}: {
  userRequest: string;
  siteConfig: SiteConfig;
}) => {
  try {
    const workflow = new NavigationWorkflow(userRequest, siteConfig);
    const result = await workflow.execute();

    return {
      success: true,
      details: workflow.generateReport(result.success, result.details),
    };
  } catch (error) {
    updateActionStatus({
      message:
        error instanceof Error
          ? error.message
          : "Sorry, something went wrong. Please try again or report the issue to us.",
      status: "failed",
    });
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong when executing the navigation workflow",
      details: "Execution failed due to error",
    };
  }
};

export const navigationWorkflowConfig: Tool = {
  functionDeclarations: [
    {
      name: "navigationWorkflow",
      description: `Helps resolve a user request by analyzing user request and performing click actions on the website for navigation.
Simply provide the user's general request and receive the status in response. The result indicates what actions were completed.`,
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          userRequest: {
            type: SchemaType.STRING,
            description:
              "The general request of the user. It should be a single sentence. Don't need to specify what actions to perform.",
          },
        },
        required: ["userRequest"],
      },
    },
  ],
};
