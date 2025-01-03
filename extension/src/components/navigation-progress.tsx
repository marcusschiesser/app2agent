import { useEffect, useState } from "react";
import { stopNavigation } from "@/lib/tools/navigation-tool";

export interface NavigationProgress {
  total: number;
  current: number;
  action: string;
  steps?: string[];
  error?: string;
  status?: "running" | "completed" | "failed";
}

export function useNavigationProgress() {
  const [navigationProgress, setNavigationProgress] =
    useState<NavigationProgress | null>(null);

  useEffect(() => {
    const handleNavigationProgress = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "A2A_NAVIGATION_PROGRESS"
      ) {
        setNavigationProgress(event.data);
      }
    };

    window.addEventListener("message", handleNavigationProgress);
    return () => {
      window.removeEventListener("message", handleNavigationProgress);
    };
  }, []);

  return navigationProgress;
}

export function NavigationProgressBar({
  progress,
}: {
  progress: NavigationProgress;
}) {
  const percentage = (progress.current / progress.total) * 100;
  const isCompleted = progress.status === "completed";
  const isFailed = progress.status === "failed";
  const [isStopping, setIsStopping] = useState(false);
  const [lastProgress, setLastProgress] = useState(progress.current);

  const handleStop = () => {
    setIsStopping(true);
    setLastProgress(progress.current);
    stopNavigation();
  };

  // Reset stopping state when status changes
  useEffect(() => {
    if (isFailed || isCompleted) {
      setIsStopping(false);
    }
  }, [isFailed, isCompleted]);

  // Preserve the last progress when stopping
  const currentProgress = isStopping ? lastProgress : progress.current;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isCompleted
                ? "bg-green-600"
                : isFailed
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {!isCompleted && !isFailed && (
          <button
            onClick={handleStop}
            disabled={isStopping}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 min-w-[60px] flex items-center justify-center"
          >
            {isStopping ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              "Stop"
            )}
          </button>
        )}
        {isCompleted && (
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {isFailed && (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {progress.steps && (
        <div className="space-y-2">
          {progress.steps
            .filter((step) => step.trim() !== "")
            .map((step, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="flex-shrink-0 mt-1">
                  {index < currentProgress ? (
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : index === currentProgress ? (
                    isFailed ? (
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-blue-500 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    )
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div
                  className={`flex-1 min-w-0 overflow-hidden ${
                    index < currentProgress
                      ? "text-gray-500"
                      : index === currentProgress
                        ? isFailed
                          ? "text-red-600 font-medium"
                          : "text-blue-600 font-medium"
                        : "text-gray-600"
                  }`}
                >
                  <p className="break-all whitespace-normal">{step}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="mt-2 text-sm flex justify-between items-center">
        <span
          className={
            isFailed
              ? "text-red-600"
              : isCompleted
                ? "text-green-600"
                : "text-gray-600"
          }
        >
          {isFailed
            ? progress.error || "Navigation stopped"
            : isCompleted
              ? "Navigation completed successfully"
              : progress.action.startsWith("Completed:")
                ? "" // Hide "Completed: [step]" messages
                : progress.action}
        </span>
        <span className="font-medium">{`${currentProgress}/${progress.total}`}</span>
      </div>
    </div>
  );
}
