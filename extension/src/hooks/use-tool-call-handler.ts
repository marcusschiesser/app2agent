import { MultimodalLiveClient } from "@/lib/multimodal-live-client";
import { ToolCall } from "@/multimodal-live-types";
import { SiteConfig } from "./use-config";
import { ToolManager } from "@/lib/tools/manager";
import { useEffect } from "react";

interface UseToolCallHandlerProps {
  client: MultimodalLiveClient | undefined;
  siteConfig: SiteConfig;
  tools: ToolManager;
}

export function useToolCallHandler({
  client,
  siteConfig,
  tools,
}: UseToolCallHandlerProps) {
  useEffect(() => {
    if (!client) {
      return;
    }

    const handleToolCall = async (toolCall: ToolCall) => {
      console.log("Tool Call Received:", JSON.stringify(toolCall, null, 2));
      const response = await tools.handleToolCall(toolCall, siteConfig);
      console.log("Tool response:", JSON.stringify(response, null, 2));
      client.sendToolResponse(response);

      // Avoid telling the user for a tool call that is still running
      if (!tools.isRunning()) {
        // Send a message to LLM for the tool call result
        client.send({
          text: "A tool call has been completed. Check the status and tell me the result.",
        });
      }
    };

    client.on("toolcall", handleToolCall);

    return () => {
      client.off("toolcall", handleToolCall);
    };
  }, [client, siteConfig, tools]);

  return {
    isRunning: tools.isRunning,
  };
}
