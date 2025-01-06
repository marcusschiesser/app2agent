import { useEffect, useState, useRef } from "react";
import { useChromeTabCapture } from "@/hooks/use-chrome-tab-capture";
import { useAppContext } from "@/contexts/LiveAPIContext";
import { AudioRecorder } from "@/lib/audio-recorder";
import { CallForm } from "./call-form";
import { Feedback } from "./feedback";
import { audioContext } from "@/lib/audio-context";
import { createDialingTone } from "@/lib/dialing-tone";
import { playConnectedTone } from "@/lib/connected-tone";
import { ToolCall } from "@/multimodal-live-types";
import { Spinner } from "./ui/icons";
import { useTools } from "@/contexts/ToolsContext";

export interface RecorderProps {
  onFinished?: () => void;
}

export function Recorder({ onFinished }: RecorderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    action: string;
    status?: "running" | "completed" | "failed";
    error?: string;
  } | null>(null);
  const {
    stream,
    start: startCapture,
    stop: stopCapture,
  } = useChromeTabCapture();
  const { liveAPI, siteConfig } = useAppContext();
  const connected = liveAPI?.connected ?? false;
  const client = liveAPI?.client;

  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted] = useState(false);
  const [inVolume, setInVolume] = useState(0);
  const dialingToneRef = useRef<{ stop: () => void } | null>(null);
  const tools = useTools();

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
      // Clear action status after tool call is complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      setActionStatus(null);
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
        event.data?.type === "A2A_ACTION_STATUS"
      ) {
        setActionStatus({
          action: event.data.action,
          status: event.data.status,
          error: event.data.error,
        });
      }
    };

    window.addEventListener("message", handleNavigationProgress);
    return () => {
      window.removeEventListener("message", handleNavigationProgress);
    };
  }, []);

  return (
    <div className="p-4 min-w-[200px]">
      <CallForm
        isEnabled={isEnabled}
        onToggle={handleToggleEnabled}
        volume={inVolume}
      />
      {actionStatus && (
        <div
          className={`mt-2 p-2 rounded-md text-sm flex items-center gap-2 justify-between ${
            actionStatus.status === "failed"
              ? "bg-red-50"
              : actionStatus.status === "completed"
                ? "bg-green-50"
                : "bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionStatus.status === "running" && <Spinner />}
            <span
              className={`${
                actionStatus.status === "failed"
                  ? "text-red-600"
                  : actionStatus.status === "completed"
                    ? "text-green-600"
                    : "text-gray-600"
              }`}
            >
              {actionStatus.action || actionStatus.error}
            </span>
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
