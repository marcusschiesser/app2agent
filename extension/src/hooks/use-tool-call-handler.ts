import { MultimodalLiveClient } from "@/lib/multimodal-live-client";
import { ToolCall } from "@/multimodal-live-types";
import { SiteConfig } from "@/lib/config";
import { ToolManager } from "@/lib/tools/manager";
import { useEffect, useState } from "react";
import { ActionEvent, EVENT_TYPE } from "@/lib/events";

export interface UseToolCallHandlerProps {
  client: MultimodalLiveClient | undefined;
  siteConfig: SiteConfig;
  tools: ToolManager;
}

export function useToolCallHandler({
  client,
  siteConfig,
  tools,
}: UseToolCallHandlerProps) {
  const [isStoppingExecution, setIsStoppingExecution] = useState(false);
  const [event, setEvent] = useState<ActionEvent | null>(null);

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

  useEffect(() => {
    const handleUpdate = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === EVENT_TYPE.ACTION_STATUS
      ) {
        const newEvent = event.data as ActionEvent;
        setEvent(newEvent);
      }
    };

    window.addEventListener("message", handleUpdate);
    return () => {
      window.removeEventListener("message", handleUpdate);
    };
  }, []);

  const handleStopExecution = () => {
    setIsStoppingExecution(true);
    tools.stop();
  };

  return {
    event,
    isStoppingExecution,
    handleStopExecution,
  };
}
