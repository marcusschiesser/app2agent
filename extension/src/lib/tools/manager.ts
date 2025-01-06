import { FunctionDeclarationsTool, Tool } from "@google/generative-ai";
import {
  ToolCall,
  ToolResponse,
  LiveFunctionResponse,
} from "@/multimodal-live-types";
import {
  navigationWorkflowConfig,
  navigationWorkflow,
} from "./navigation-workflow";
import { SiteConfig } from "@/hooks/use-config";

// Map of tool implementations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToolImplementation = (args: any) => Promise<any>;

export class ToolManager {
  private toolMap: Map<string, ToolImplementation> = new Map();
  private tools: FunctionDeclarationsTool[] = [];
  private isRunningTool: boolean = false;
  private currentToolName: string | null = null;

  constructor() {
    this.registerTool(navigationWorkflowConfig, navigationWorkflow);
  }

  // Register a tool and its implementation
  private registerTool(tool: Tool, implementation: ToolImplementation) {
    if (
      "functionDeclarations" in tool &&
      tool.functionDeclarations?.[0]?.name
    ) {
      const functionName = tool.functionDeclarations[0].name;
      this.toolMap.set(functionName, implementation);
      this.tools.push(tool);
    }
  }

  public isRunning(): boolean {
    return this.isRunningTool;
  }

  // Get all tool configs for LLM
  public getTools(): FunctionDeclarationsTool[] {
    return this.tools;
  }

  // Handle tool calls from LLM
  public async handleToolCall(
    toolCall: ToolCall,
    siteConfig: SiteConfig,
  ): Promise<ToolResponse> {
    if (this.isRunningTool) {
      return {
        functionResponses: toolCall.functionCalls.map((call) => ({
          response: {
            success: false,
            error: `Another tool (${this.currentToolName}) is currently running. Please wait for it to complete.`,
          },
          id: call.id,
        })),
      };
    }

    try {
      this.isRunningTool = true;
      const functionResponses: LiveFunctionResponse[] = await Promise.all(
        toolCall.functionCalls.map(async (call) => {
          try {
            const implementation = this.toolMap.get(call.name);
            if (!implementation) {
              throw new Error(`No implementation found for tool: ${call.name}`);
            }
            this.currentToolName = call.name;
            // Tools now get config values directly from SiteConfig
            const result = await implementation({
              ...call.args,
              siteConfig,
            });
            return {
              response: result,
              id: call.id,
            };
          } catch (error) {
            console.error("Error handling tool call:", error);
            return {
              response: {
                success: false,
                error: "Error: " + JSON.stringify(error),
              },
              id: call.id,
            };
          }
        }),
      );

      return {
        functionResponses,
      };
    } finally {
      this.isRunningTool = false;
      this.currentToolName = null;
    }
  }

  public getPrompt(): string {
    return this.tools
      .map(
        (tool) =>
          tool.functionDeclarations?.[0]?.name +
          ": " +
          tool.functionDeclarations?.[0]?.description,
      )
      .join("\n");
  }
}
