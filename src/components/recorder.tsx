import { useEffect, useState, useRef } from "react";
import { useChromeTabCapture } from "@/hooks/use-chrome-tab-capture";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { AudioRecorder } from "@/lib/audio-recorder";
import { CallForm } from "./call-form";

export function Recorder() {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    stream,
    isStreaming,
    start: startCapture,
    stop: stopCapture,
  } = useChromeTabCapture();
  const { client, connect, disconnect, connected } = useLiveAPIContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);

  // Load initial state from storage
  useEffect(() => {
    chrome.storage.local.get(["isEnabled"], (result) => {
      if (result.isEnabled !== undefined) {
        setIsEnabled(result.isEnabled);
      }
    });
  }, []);

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
      audioRecorder.on("data", onData).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off("data", onData);
    };
  }, [connected, client, muted, isEnabled, audioRecorder]);

  useEffect(() => {
    if (isEnabled && !isStreaming) {
      startCapture().then(() => {
        connect();
      });
    } else if (!isEnabled && isStreaming) {
      stopCapture();
      disconnect();
    }
  }, [isEnabled, isStreaming]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    let timeoutId = -1;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas) {
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

  return (
    <div className="p-4 min-w-[200px]">
      <CallForm
        isEnabled={isEnabled}
        onToggle={(checked) => {
          setIsEnabled(checked);
          // Save state to storage
          chrome.storage.local.set({ isEnabled: checked });
        }}
      />
      <video ref={videoRef} style={{ display: "none" }} autoPlay />
      <canvas ref={renderCanvasRef} style={{ display: "none" }} />
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
