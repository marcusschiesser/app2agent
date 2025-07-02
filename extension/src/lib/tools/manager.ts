import { BaseTool } from "llamaindex";

export class ToolManager {
  private tools: BaseTool[] = [];

  constructor() {}

  // Register a tool and its implementation
  private registerTool(tool: BaseTool) {
    this.tools.push(tool);
  }

  // Get all tool configs for LLM
  public getTools(): BaseTool[] | undefined {
    return this.tools.length > 0 ? this.tools : undefined;
  }
}
