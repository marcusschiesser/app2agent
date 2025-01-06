import { ActionEvent, EVENT_TYPE } from "@/lib/events";
import { Spinner } from "./ui/icons";
import { useEffect, useState } from "react";

function useActionStatus() {
  const [status, setStatus] = useState<ActionEvent | null>(null);

  useEffect(() => {
    const handleNavigationProgress = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === EVENT_TYPE.ACTION_STATUS
      ) {
        const newStatus = event.data as ActionEvent;
        setStatus(newStatus);
      }
    };

    window.addEventListener("message", handleNavigationProgress);
    return () => {
      window.removeEventListener("message", handleNavigationProgress);
    };
  }, []);

  return status;
}

export function ActionStatus() {
  const status = useActionStatus();

  if (!status) return null;

  return (
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
  );
}
