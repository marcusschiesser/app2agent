import React from "react";
import { createRoot, Root } from "react-dom/client";
import { ModalApp } from "@/pages/shared/modal-app";
import { getInjectScript } from "@/lib/env";

// Create root only when needed
let appRoot: Root | null = null;

// TODO: merge with modal root code @modal.tsx
const createAppRoot = async () => {
  if (!appRoot) {
    // Get configuration from script tag for positioning
    const scriptTag = getInjectScript();
    const top = scriptTag?.getAttribute("data-top") ?? "1rem";
    const right = scriptTag?.getAttribute("data-right") ?? "1rem";

    // Create a container for the app
    const appContainer = document.createElement("div");
    appContainer.id = "app2agent-modal";
    appContainer.style.cssText = `
      position: fixed;
      top: ${top};
      right: ${right};
      z-index: 2147483647;
      pointer-events: auto;
      display: inline-block;
    `;

    // Add a shadow root for better style isolation
    const shadow = appContainer.attachShadow({ mode: "open" });

    // Create style element and add our CSS from the global variable
    const style = document.createElement("style");

    // Use the CSS from our global variable that was set by the Vite plugin
    if (window.APP2AGENT_INJECT_CSS) {
      style.textContent = window.APP2AGENT_INJECT_CSS;
    } else {
      console.warn("App2Agent: CSS not found in global variable");
    }

    shadow.appendChild(style);

    const styleContainer = document.createElement("div");
    styleContainer.className = "form2content-styles";
    shadow.appendChild(styleContainer);

    document.body.appendChild(appContainer);
    appRoot = createRoot(styleContainer);
  }
  return appRoot;
};

// Initialize app
const initApp = async () => {
  const root = await createAppRoot();

  // Get configuration from script tag
  const scriptTag = getInjectScript();
  const apiKey =
    scriptTag?.getAttribute("data-api-key") ??
    window.APP2AGENT_API_KEY ??
    undefined;

  root.render(
    <React.StrictMode>
      <ModalApp apiKey={apiKey} />
    </React.StrictMode>,
  );
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
