import { ActionEvent, EVENT_TYPE, stopNavigation } from "@/lib/events";
import { Spinner } from "./ui/icons";
import { useEffect, useState } from "react";
import { useTools } from "@/contexts/ToolsContext";

function useActionStatus() {
  const [status, setStatus] = useState<ActionEvent | null>(null);
  const [isStoppingNavigation, setIsStoppingNavigation] = useState(false);

  useEffect(() => {
    const handleNavigationProgress = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === EVENT_TYPE.ACTION_STATUS
      ) {
        const newStatus = event.data as ActionEvent;
        setStatus(newStatus);

        // Reset stopping state when we get a new status
        if (newStatus.status === "completed" || newStatus.status === "failed") {
          setIsStoppingNavigation(false);
        }
      }
    };

    window.addEventListener("message", handleNavigationProgress);
    return () => {
      window.removeEventListener("message", handleNavigationProgress);
    };
  }, []);

  const handleStopNavigation = () => {
    setIsStoppingNavigation(true);
    stopNavigation();
  };

  return {
    status,
    isStoppingNavigation,
    handleStopNavigation,
  };
}

export function ActionStatus() {
  const { status, isStoppingNavigation, handleStopNavigation } =
    useActionStatus();
  const tools = useTools();

  return (
    <>
      {status && (
        <div
          className={`mt-2 p-2 rounded-md text-sm flex items-center gap-2 justify-between ${
            status.status === "failed"
              ? "bg-red-50"
              : status.status === "completed"
                ? "bg-green-50"
                : "bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.status === "running" && <Spinner />}
            <span
              className={`${
                status.status === "failed"
                  ? "text-red-600"
                  : status.status === "completed"
                    ? "text-green-600"
                    : "text-gray-600"
              }`}
            >
              {status.message}
            </span>
          </div>
        </div>
      )}

      {tools.isRunning() && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleStopNavigation}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            disabled={isStoppingNavigation}
          >
            {isStoppingNavigation ? "Stopping..." : "Stop navigation"}
          </button>
        </div>
      )}
    </>
  );
}
