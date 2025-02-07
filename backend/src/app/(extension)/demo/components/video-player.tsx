"use client";

import { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const wasPlayingRef = useRef(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);

    const handleCallEvent = (event: MessageEvent) => {
      if (!playerRef.current) return;

      if (event.data.type === "A2A_CALL_START") {
        // Store current playing state
        const player = playerRef.current.getInternalPlayer();
        wasPlayingRef.current = player?.getPlayerState() === 1; // 1 is PLAYING state
        // Pause the video
        playerRef.current.getInternalPlayer()?.pauseVideo();
      } else if (event.data.type === "A2A_CALL_END" && wasPlayingRef.current) {
        // Resume video if it was playing before
        playerRef.current.getInternalPlayer()?.playVideo();
        wasPlayingRef.current = false;
      }
    };

    window.addEventListener("message", handleCallEvent);

    return () => {
      window.removeEventListener("message", handleCallEvent);
    };
  }, []);

  if (!origin) return null;

  return (
    <div className="aspect-video w-full">
      <ReactPlayer
        ref={playerRef}
        url={src}
        width="100%"
        height="100%"
        controls
        config={{
          playerVars: {
            origin,
          },
        }}
      />
    </div>
  );
}
