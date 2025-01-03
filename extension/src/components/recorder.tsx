import { useEffect, useState, useRef } from "react";
import { useChromeTabCapture } from "@/hooks/use-chrome-tab-capture";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { AudioRecorder } from "@/lib/audio-recorder";
import { CallForm } from "./call-form";
import { Feedback } from "./feedback";
import { audioContext } from "@/lib/audio-context";
import { createDialingTone } from "@/lib/dialing-tone";
import { playConnectedTone } from "@/lib/connected-tone";
import { ToolCall } from "@/multimodal-live-types";
import { toolManager } from "@/lib/tools/manager";
import { stopNavigation } from "@/lib/tools/navigation-tool";

export interface RecorderProps {
  onFinished?: () => void;
}

interface NavigationProgress {
  total: number;
  current: number;
  action: string;
  steps?: string[];
  error?: string;
  status?: "running" | "completed" | "failed";
}

function NavigationProgressBar({ progress }: { progress: NavigationProgress }) {
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

export function Recorder({ onFinished }: RecorderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const {
    stream,
    start: startCapture,
    stop: stopCapture,
  } = useChromeTabCapture();
  const { liveAPI } = useLiveAPIContext();
  const connected = liveAPI?.connected ?? false;
  const client = liveAPI?.client;

  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted] = useState(false);
  const [inVolume, setInVolume] = useState(0);
  const dialingToneRef = useRef<{ stop: () => void } | null>(null);
  const [navigationProgress, setNavigationProgress] =
    useState<NavigationProgress | null>(null);

  useEffect(() => {
    const onData = (base64: string) => {
      if (client && connected) {
        client.sendRealtimeInput([
          {
            mimeType: "audio/pcm;rate=16000",
            data: base64,
          },
        ]);
      }
    };

    if (connected && !muted && isEnabled) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, isEnabled, audioRecorder]);

  useEffect(() => {
    if (isEnabled && !connected) {
      // Start dialing tone when attempting to connect
      audioContext({ id: "audio-out" }).then((ctx) => {
        dialingToneRef.current = createDialingTone(ctx);
      });
    } else if (dialingToneRef.current) {
      // Stop dialing tone when connected or disabled
      dialingToneRef.current.stop();
      dialingToneRef.current = null;

      // Play connected tone if we're still enabled
      if (isEnabled && connected) {
        audioContext({ id: "audio-out" }).then((ctx) => {
          playConnectedTone(ctx);
        });
      }
    }
  }, [isEnabled, connected]);

  const handleToggleEnabled = async (checked: boolean) => {
    if (!liveAPI) {
      console.error("LiveAPI is not ready");
      return;
    }

    if (checked) {
      setIsEnabled(true);
      await startCapture();
      liveAPI.connect();
    } else {
      setIsEnabled(false);
      setShowFeedback(true);
      stopCapture();
      liveAPI.disconnect();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    let timeoutId = -1;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas || !client) {
        return;
      }

      const ctx = canvas.getContext("2d")!;
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;

      if (canvas.width + canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 1.0);
        const data = base64.slice(base64.indexOf(",") + 1, Infinity);
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);
      }

      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5);
      }
    }

    if (connected && stream !== null) {
      requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [connected, stream, client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    const handleToolCall = async (toolCall: ToolCall) => {
      console.log("Tool Call Received:", JSON.stringify(toolCall, null, 2));
      const response = await toolManager.handleToolCall(toolCall);
      console.log("Tool response:", JSON.stringify(response, null, 2));
      client.sendToolResponse(response);
    };

    client.on("toolcall", handleToolCall);

    return () => {
      client.off("toolcall", handleToolCall);
    };
  }, [client]);

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

  useEffect(() => {
    const handleScreenshotRequest = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "A2A_GET_SCREENSHOT"
      ) {
        const video = videoRef.current;
        const canvas = renderCanvasRef.current;

        if (!video || !canvas) {
          window.postMessage(
            {
              type: "A2A_SCREENSHOT_RESULT",
              screenshot: "",
            },
            window.location.origin,
          );
          return;
        }

        const ctx = canvas.getContext("2d")!;
        canvas.width = video.videoWidth * 0.25;
        canvas.height = video.videoHeight * 0.25;

        if (canvas.width + canvas.height > 0) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/jpeg", 1.0);
          const screenshot = base64.slice(base64.indexOf(",") + 1, Infinity);
          window.postMessage(
            {
              type: "A2A_SCREENSHOT_RESULT",
              screenshot,
            },
            window.location.origin,
          );
        } else {
          window.postMessage(
            {
              type: "A2A_SCREENSHOT_RESULT",
              screenshot: "",
            },
            window.location.origin,
          );
        }
      }
    };

    window.addEventListener("message", handleScreenshotRequest);
    return () => {
      window.removeEventListener("message", handleScreenshotRequest);
    };
  }, []);

  return (
    <div className="p-4 min-w-[200px]">
      <CallForm
        isEnabled={isEnabled}
        onToggle={handleToggleEnabled}
        volume={inVolume}
      />
      {navigationProgress && (
        <NavigationProgressBar progress={navigationProgress} />
      )}
      {showFeedback && !isEnabled && (
        <Feedback
          onSubmit={(rating) => {
            console.log("Call feedback:", rating);
            setShowFeedback(false);
            if (onFinished) {
              onFinished();
            }
          }}
        />
      )}
      <video ref={videoRef} style={{ display: "none" }} autoPlay />
      <canvas ref={renderCanvasRef} style={{ display: "none" }} />
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
