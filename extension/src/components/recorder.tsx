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
import { Spinner } from "./ui/icons";

export interface RecorderProps {
  onFinished?: () => void;
}

export function Recorder({ onFinished }: RecorderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>("");
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
      const executeActionCall = toolCall.functionCalls?.find(
        (call) => call.name === "executeActionTool",
      );
      if (executeActionCall) {
        try {
          if (typeof executeActionCall.args === "string") {
            const args = JSON.parse(executeActionCall.args);
            setCurrentAction(args.userRequest || "");
          } else {
            const args = executeActionCall.args as { userRequest?: string };
            setCurrentAction(args.userRequest || "");
          }
        } catch (e) {
          console.error("Failed to parse tool call arguments:", e);
        }
      }
      const response = await toolManager.handleToolCall(toolCall);
      console.log("Tool response:", JSON.stringify(response, null, 2));
      client.sendToolResponse(response);
      // Clear the action after tool call is complete
      setCurrentAction("");
    };

    client.on("toolcall", handleToolCall);

    return () => {
      client.off("toolcall", handleToolCall);
    };
  }, [client]);

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
      {currentAction && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-gray-600">Let me: {currentAction}</span>
          </div>
        </div>
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
