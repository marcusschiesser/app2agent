"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import YouTube from "react-youtube";
import { useMediaQuery } from "@/hooks/use-mobile";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoId,
}: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Configure YouTube player based on device type
  const videoOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      rel: 0,
      playsinline: 1, // Helps on iOS
    },
  };

  // Handle keyboard events and scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      if (contentRef.current) {
        // Force a re-render on orientation change
        contentRef.current.style.height = `${window.innerHeight * 0.9}px`;
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.height = "auto";
          }
        }, 300);
      }
    };

    if (isOpen && isMobile) {
      window.addEventListener("orientationchange", handleOrientationChange);
      window.addEventListener("resize", handleOrientationChange);
    }

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isOpen, isMobile]);

  // Handle swipe gestures on mobile
  useEffect(() => {
    if (!isMobile || !isOpen || !contentRef.current) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const diffY = currentY - startY;

      // If swiping down significantly
      if (diffY > 50) {
        onClose();
      }
    };

    const element = contentRef.current;
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen, isMobile, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
          onClick={handleOverlayClick}
          ref={overlayRef}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            ref={contentRef}
            className={`relative z-10 w-full mx-4 ${isFullscreen ? "max-w-full h-screen" : "max-w-5xl"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            drag={isMobile && !isFullscreen ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
          >
            <div
              className={`relative ${isFullscreen ? "h-screen" : "aspect-video"} bg-black rounded-xl overflow-hidden shadow-2xl`}
            >
              <YouTube
                videoId={videoId}
                opts={videoOptions}
                className="w-full h-full"
              />
              <div className="absolute top-0 right-0 flex items-center gap-2 p-2">
                <button
                  onClick={toggleFullscreen}
                  className="rounded-full bg-black/70 p-2 hover:bg-black text-white hover:text-blue-400 transition-colors"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className={`rounded-full bg-black/70 ${isMobile ? "p-3" : "p-2"} hover:bg-black text-white hover:text-blue-400 transition-colors`}
                  aria-label="Close video"
                >
                  <X className={`${isMobile ? "h-6 w-6" : "h-5 w-5"}`} />
                </button>
              </div>

              {isMobile && !isFullscreen && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="h-1 w-16 bg-white/30 rounded-full"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
