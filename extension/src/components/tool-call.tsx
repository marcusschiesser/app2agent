import { useTools } from "@/contexts/ToolsContext";
import { Spinner } from "./ui/icons";
import { useToolCallHandler } from "@/hooks/use-tool-call-handler";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect } from "react";

export function ToolCall() {
  const tools = useTools();
  const { liveAPI, siteConfig } = useAppContext();
  const connected = liveAPI?.connected ?? false;

  const { event, isStoppingExecution, handleStopExecution } =
    useToolCallHandler({ client: liveAPI?.client, siteConfig, tools });

  useEffect(() => {
    if (!connected) {
      tools.stop();
    }
  }, [connected]);

  return (
    <>
      {tools.isRunning() && event && connected && (
        <div
          className={`mt-2 p-2 rounded-md text-sm flex items-center gap-2 justify-between ${
            event.status === "failed"
              ? "bg-red-50"
              : event.status === "completed"
                ? "bg-green-50"
                : "bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {event.status === "running" && <Spinner />}
            <span
              className={`${
                event.status === "failed"
                  ? "text-red-600"
                  : event.status === "completed"
                    ? "text-green-600"
                    : "text-gray-600"
              }`}
            >
              {event.message}
            </span>
          </div>
        </div>
      )}

      {tools.isRunning() && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleStopExecution}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            disabled={isStoppingExecution}
          >
            {isStoppingExecution ? "Stopping..." : "Stop navigation"}
          </button>
        </div>
      )}
    </>
  );
}
