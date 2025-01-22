import { useTools } from "@/contexts/ToolsContext";
import { useToolCallHandler } from "@/hooks/use-tool-call-handler";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { MultimodalLiveClient } from "@/lib/realtime/gemini/multimodal-live-client";

export function ToolCall() {
  const tools = useTools();
  const { liveAPI, siteConfig } = useAppContext();
  const connected = liveAPI?.connected ?? false;

  const { event, isStoppingExecution, handleStopExecution } =
    useToolCallHandler({
      client: liveAPI?.client as unknown as MultimodalLiveClient,
      siteConfig,
      tools,
    });

  useEffect(() => {
    if (!connected) {
      tools.stop();
    }
  }, [connected, tools]);

  return (
    <>
      {tools.isRunning() && event && connected && (
        <div
          className={`mt-3 relative w-full rounded-lg overflow-hidden group`}
        >
          <div
            className={`w-full flex items-center gap-3 px-3 py-2 ${
              event.status === "failed"
                ? "bg-red-50"
                : event.status === "completed"
                  ? "bg-green-50"
                  : "bg-blue-50 transition-opacity duration-200 group-hover:opacity-0" // fade to button while running
            }`}
          >
            {event.status === "running" && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
            )}
            {event.status === "completed" && (
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            )}
            {event.status === "failed" && (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span
              className={`truncate text-sm ${
                event.status === "failed"
                  ? "text-red-700"
                  : event.status === "completed"
                    ? "text-green-700"
                    : "text-blue-700"
              }`}
            >
              {event.message}
            </span>
          </div>
          {event.status === "running" && (
            <button
              onClick={handleStopExecution}
              className="absolute inset-0 flex items-center justify-center gap-3 px-3 py-2 text-sm text-red-700 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100"
              disabled={isStoppingExecution}
            >
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{isStoppingExecution ? "Stopping..." : "Stop"}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
