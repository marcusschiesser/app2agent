import { stopNavigation } from "../events";
import { BaseTool } from "llamaindex";

// Map of tool implementations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// type ToolImplementation = (args: any) => Promise<any>;

export class ToolManager {
  // private toolMap: Map<string, ToolImplementation> = new Map();
  private tools: BaseTool[] = [];
  private isRunningTool: boolean = false;
  // private currentToolName: string | null = null;

  constructor() {
    // this.registerTool(navigationWorkflowConfig, navigationWorkflow);
  }

  // Register a tool and its implementation
  private registerTool(tool: BaseTool) {
    // if (
    //   "functionDeclarations" in tool &&
    //   tool.functionDeclarations?.[0]?.name
    // ) {
    //   const functionName = tool.functionDeclarations[0].name;
    //   this.toolMap.set(functionName, implementation);
    this.tools.push(tool);
    // }
  }

  public isRunning(): boolean {
    return this.isRunningTool;
  }

  public async stop() {
    if (this.isRunningTool) {
      // Send a message for stopping the tool
      stopNavigation();
    }
  }

  // Get all tool configs for LLM
  public getTools(): BaseTool[] | undefined {
    return this.tools.length > 0 ? this.tools : undefined;
  }
}

//   // Handle tool calls from LLM
//   public async handleToolCall(
//     toolCall: ToolCall,
//     siteConfig: SiteConfig,
//   ): Promise<ToolResponse> {
//     if (this.isRunningTool) {
//       return {
//         functionResponses: toolCall.functionCalls.map((call) => ({
//           response: {
//             success: false,
//             error: `Another tool (${this.currentToolName}) is currently running. Please wait for it to complete.`,
//           },
//           id: call.id,
//         })),
//       };
//     }

//     try {
//       this.isRunningTool = true;
//       const functionResponses: LiveFunctionResponse[] = await Promise.all(
//         toolCall.functionCalls.map(async (call) => {
//           try {
//             const implementation = this.toolMap.get(call.name);
//             if (!implementation) {
//               throw new Error(`No implementation found for tool: ${call.name}`);
//             }
//             this.currentToolName = call.name;
//             // Tools now get config values directly from SiteConfig
//             const result = await implementation({
//               ...call.args,
//               siteConfig,
//             });
//             return {
//               response: result,
//               id: call.id,
//             };
//           } catch (error) {
//             console.error("Error handling tool call:", error);
//             return {
//               response: {
//                 success: false,
//                 error: "Error: " + JSON.stringify(error),
//               },
//               id: call.id,
//             };
//           }
//         }),
//       );

//       return {
//         functionResponses,
//       };
//     } finally {
//       this.isRunningTool = false;
//       this.currentToolName = null;
//     }
//   }

//   public getPrompt(): Part[] {
//     if (this.tools.length === 0) {
//       return [];
//     }
//     const toolsPrompt = this.tools
//       .map(
//         (tool) =>
//           tool.functionDeclarations?.[0]?.name +
//           ": " +
//           tool.functionDeclarations?.[0]?.description,
//       )
//       .join("\n");
//     return [
//       {
//         text: `You can use the following tools to help you with your task to reach the user's goal:\n${toolsPrompt}\n
//       Tool use policies:
// 1. To resolve user request, perform only a single call to a tool with the user's request.
// 2. Once the tool call is completed, check the response in the result and do not try to make the same request again and update the status to the user.`,
//       },
//     ];
//   }
// }
