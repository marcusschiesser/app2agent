"use client";

import { useState, useCallback, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { getBaseUrl } from "@/lib/url";

export default function DemoPage() {
  const [currentUrl, setCurrentUrl] = useState(
    "https://school.moodledemo.net/login/index.php",
  );
  const [error, setError] = useState<string | null>(null);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = useCallback(() => {
    setIsMainLoading(false);

    try {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow?.document) return;

      const doc = iframe.contentWindow.document;
      doc.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");
        if (link?.href) {
          e.preventDefault();
          setCurrentUrl(link.href);
          setError(null);
          setIsMainLoading(true);
        }
      });
    } catch (err) {
      console.error("Failed to add click handler to iframe:", err);
    }
  }, []);

  const getProxyUrl = useCallback((targetUrl: string) => {
    const apiUrl = new URL("/api/proxy", getBaseUrl());
    apiUrl.searchParams.set("url", targetUrl);
    return apiUrl.toString();
  }, []);

  const handleIframeError = () => {
    setError("Failed to load the website. Please try a different URL.");
    setIsMainLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toolbar */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 bg-amber-50 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Browser Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            src={getProxyUrl(currentUrl)}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
            referrerPolicy="no-referrer"
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
          {isMainLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
