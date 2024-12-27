import "@/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Recorder } from "@/components/recorder";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

declare const __GEMINI_API_KEY__: any;

function SidePanelApp() {
  return (
    <div className="p-4">
      <Recorder />
    </div>
  );
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

const container = document.getElementById("app-container");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LiveAPIProvider url={uri} apiKey={__GEMINI_API_KEY__}>
      <SidePanelApp />
    </LiveAPIProvider>
  </React.StrictMode>,
);
