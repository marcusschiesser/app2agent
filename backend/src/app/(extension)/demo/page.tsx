"use client";

import { useState, useCallback, useRef } from "react";
import { Search, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`;

export default function DemoPage() {
  const [inputUrl, setInputUrl] = useState("https://ezamowienia.gov.pl");
  const [currentUrl, setCurrentUrl] = useState("https://ezamowienia.gov.pl");
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
          setInputUrl(link.href);
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
    const apiUrl = new URL("/api/proxy", baseUrl);
    apiUrl.searchParams.set("url", targetUrl);
    return apiUrl.toString();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
      setInputUrl(url);
    }
    setCurrentUrl(url);
    setError(null);
    setIsMainLoading(true);
  };

  const handleIframeError = () => {
    setError("Failed to load the website. Please try a different URL.");
    setIsMainLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 p-2 border-b">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center flex-1 gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent outline-none min-w-0"
              placeholder="Enter URL (e.g., www.google.com)"
            />
            {isMainLoading && (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin flex-shrink-0" />
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">Go</span>
          </button>
        </form>
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 bg-amber-50 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

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
