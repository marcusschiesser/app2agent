import React from "react";
import { createRoot, Root } from "react-dom/client";
import { ModalApp } from "@/pages/shared/modal-app";

// Create root only when needed
let appRoot: Root | null = null;

// TODO: merge with modal root code @modal.tsx
const createAppRoot = async () => {
  if (!appRoot) {
    // Create a container for the app
    const appContainer = document.createElement("div");
    appContainer.id = "form2content-modal";
    appContainer.className =
      "form2content-styles fixed top-4 right-4 z-[2147483647] pointer-events-auto inline-block";

    // Add a shadow root for better style isolation
    const shadow = appContainer.attachShadow({ mode: "open" });

    // Find our script tag and use it to construct the style.css path
    const scripts = Array.from(document.getElementsByTagName("script"));
    const injectScript = scripts.find((script) =>
      script.src.includes("inject.js"),
    );
    if (!injectScript) {
      throw new Error("Could not find inject.js script tag");
    }
    const styleUrl = injectScript.src.replace("inject.js", "style.css");

    // Fetch and inject styles into shadow root
    await fetch(styleUrl)
      .then((response) => response.text())
      .then((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);
      });

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
  const scriptTag = document.currentScript as HTMLScriptElement;
  const config = {
    apiKey: scriptTag?.dataset.apiKey || "",
  };

  root.render(
    <React.StrictMode>
      <ModalApp />
    </React.StrictMode>,
  );
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
