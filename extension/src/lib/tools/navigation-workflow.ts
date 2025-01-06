import { SchemaType, Tool } from "@google/generative-ai";
import { executeActionTool } from "./execute-action";
import { cleanLLMResponse, getLLMResponse } from "../llm";
import { SiteConfig } from "@/hooks/use-config";

type ExecutionState = "pending" | "in_progress" | "completed" | "failed";

interface Action {
  action: string;
  explanation?: string;
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
        event.data?.type === "A2A_STOP_ACTION"
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
  "explanation": "The user's goal is already achieved"
}

IMPORTANT:
- The provided screenshot is the important information to determine the next action. Avoid making up actions that are not present in the screenshot.
- Based on the execution history, avoid repeating the same action that has already been done.
- If the action related to element has state like checkbox, select, dropdown, etc. then always use the current state of the element to determine the next action.
- Always respond in JSON format.

Example:
User request: "I want to buy a new laptop"
Screenshot context: "The screenshot shows a shopping website but the user is on the home page. There is a 'Shop' link on the top right corner of the page."
Previous actions: "Empty"
Your answer: 
{
  "action": "Click on the 'Shop' link",
  "explanation": "The user is on the home page and the goal is to buy a new laptop. The 'Shop' link is on the top right corner of the page."
}

User request: "I want to buy a new laptop"
Screenshot context: "The screenshot shows a shopping website and a Shop tabs is active and there are some laptops listed."
Previous actions: "Click on the 'Shop' link"
Your answer: 
{
  "action": null,
  "explanation": "The user's goal is already achieved"
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
      "models/gemini-2.0-flash-exp",
    );

    const nextAction = JSON.parse(cleanLLMResponse(result.text()));
    return {
      action: nextAction.action,
      explanation: nextAction.explanation,
      status: "pending",
    };
  }

  private async executeStep(step: Action): Promise<void> {
    const result = await executeActionTool({
      userRequest: step.action,
      click: true,
      siteConfig: this.siteConfig,
    });

    if (!result.success) {
      throw new Error(result.result.toString());
    }

    step.result = result.result.toString();
  }

  async execute(
    maxRetries: number = 3,
  ): Promise<{ success: boolean; details: string }> {
    try {
      // Initialize workflow
      this.reportProgress({
        total: 1,
        current: 0,
        action: "Thinking...",
        steps: [],
        status: "running",
      });

      let retries = 0;
      while (!this.shouldStop && retries < maxRetries) {
        // 1. Predict next step
        const step = await this.predictNextStep();

        // 2. Return if prediction error or no more actions
        if (!step.action) {
          this.reportProgress({
            total: this.executionHistory.length,
            current: this.executionHistory.length,
            action: "Completed: No more actions to perform",
            steps: this.executionHistory.map((a) => a.action),
            status: "completed",
          });
          return {
            success: true,
            details:
              step.explanation || "Completed: No more actions to perform",
          };
        }

        // 3. Execute the step
        this.reportProgress({
          total: this.executionHistory.length + 1,
          current: this.executionHistory.length,
          action: `Executing: ${step.action}`,
          steps: [...this.executionHistory.map((a) => a.action), step.action],
          status: "running",
        });

        try {
          step.status = "in_progress";
          await this.executeStep(step);
          step.status = "completed";
          this.executionHistory.push(step);
        } catch (error) {
          // 4. Update step error and status
          step.status = "failed";
          step.error = error instanceof Error ? error.message : "Unknown error";
          this.executionHistory.push(step);

          this.reportProgress({
            total: this.executionHistory.length,
            current: this.executionHistory.length - 1,
            action: `Failed: ${step.action}\nReason: ${step.error}`,
            steps: this.executionHistory.map((a) => a.action),
            error: step.error,
            status: "failed",
          });
          retries++;
          continue;
        }

        // Wait before next iteration
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 5. Handle workflow stop
      if (this.shouldStop) {
        this.reportProgress({
          total: this.executionHistory.length,
          current: this.executionHistory.length - 1,
          action: "Workflow stopped by user",
          steps: this.executionHistory.map((a) => a.action),
          error: "Workflow stopped by user",
          status: "failed",
        });
        return {
          success: true,
          details: "Workflow stopped by user",
        };
      }

      // Handle max retries exceeded
      this.reportProgress({
        total: this.executionHistory.length,
        current: this.executionHistory.length - 1,
        action: "Maximum retries exceeded",
        steps: this.executionHistory.map((a) => a.action),
        error: "Maximum retries exceeded",
        status: "failed",
      });
      return {
        success: false,
        details: "Maximum retries exceeded",
      };
    } catch (error) {
      console.error("Navigation workflow failed:", JSON.stringify(error));
      this.reportProgress({
        total: this.executionHistory.length || 1,
        current: 0,
        action: "Workflow failed",
        steps: this.executionHistory.map((a) => a.action),
        error: error instanceof Error ? error.message : "Unknown error",
        status: "failed",
      });
      return {
        success: false,
        details: "Workflow failed: " + JSON.stringify(error),
      };
    }
  }

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
      report += `\n\nStatus: Completed. ${message}`;
    } else {
      report += `\n\nStatus: Failed. ${message}`;
    }

    return report;
  }

  private reportProgress(progress: {
    total: number;
    current: number;
    action: string;
    steps?: string[];
    error?: string;
    status?: "running" | "completed" | "failed";
  }) {
    console.log("Reporting progress:", JSON.stringify(progress, null, 2));
    window.postMessage(
      {
        type: "A2A_ACTION_STATUS",
        ...progress,
      },
      window.location.origin,
    );
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      details: "Execution failed due to error",
    };
  }
};

export const navigationWorkflowConfig: Tool = {
  functionDeclarations: [
    {
      name: "navigationWorkflow",
      description:
        "Helps resolve a user request for performing actions on the website. Simply provide the user's general request and receive the status in response. The result indicates what actions were completed.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          userRequest: {
            type: SchemaType.STRING,
            description:
              "The general request of the user. It should be a single sentence.",
          },
        },
        required: ["userRequest"],
      },
    },
  ],
};
