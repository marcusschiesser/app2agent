import { Tool } from "@google/generative-ai";
import { ToolCall, ToolResponse } from "@/multimodal-live-types";
import { welcomeToolConfig, handleWelcomeUser } from "./welcome-tool";

// Map of tool implementations
type ToolImplementation = (args: any) => Promise<any>;

export class ToolManager {
  private toolMap: Map<string, ToolImplementation> = new Map();
  private tools: Tool[] = [];

  constructor() {
    // Register available tools
    this.registerTool(welcomeToolConfig, handleWelcomeUser);
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

  // Get all tool configs for LLM
  public getTools(): Tool[] {
    return this.tools;
  }

  // Handle tool calls from LLM
  public async handleToolCall(toolCall: ToolCall): Promise<ToolResponse> {
    const responses = await Promise.all(
      toolCall.functionCalls.map(async (call) => {
        const implementation = this.toolMap.get(call.name);
        if (!implementation) {
          throw new Error(`No implementation found for tool: ${call.name}`);
        }

        const response = await implementation(call.args);
        return {
          response,
          id: call.id,
        };
      }),
    );

    return {
      functionResponses: responses,
    };
  }
}

// Export singleton instance
export const toolManager = new ToolManager();
