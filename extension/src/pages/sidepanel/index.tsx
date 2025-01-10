import "@/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Recorder } from "@/components/recorder";
import { AppProvider } from "@/contexts/AppContext";
import { useConfig } from "@/hooks/use-config";
import { ToolsProvider } from "@/contexts/ToolsContext";

function SidePanelApp() {
  const config = useConfig();

  return (
    <div className="p-4">
      <ToolsProvider>
        <AppProvider config={config}>
          <Recorder />
        </AppProvider>
      </ToolsProvider>
    </div>
  );
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

const container = document.getElementById("app-container");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SidePanelApp />
  </React.StrictMode>,
);
