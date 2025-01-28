import React from "react";
import { createRoot, Root } from "react-dom/client";
import { FloatingContainer } from "./components/FloatingContainer";

// Create root only when needed
let appRoot: Root | null = null;

const createAppRoot = async () => {
  if (!appRoot) {
    // Create a container for the app
    const appContainer = document.createElement("div");
    appContainer.id = "form2content-modal";
    appContainer.className =
      "form2content-styles fixed top-4 right-4 z-[2147483647] pointer-events-auto inline-block";

    // Add a shadow root for better style isolation
    const shadow = appContainer.attachShadow({ mode: "open" });

    // Create and inject styles into shadow root
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      .form2content-styles {
        font-family: 'Inter', sans-serif;
      }

      .floating-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 16px;
        max-width: 400px;
        width: 100%;
      }

      .close-button {
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .close-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    `;
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
  const scriptTag = document.currentScript as HTMLScriptElement;
  const config = {
    apiKey: scriptTag?.dataset.apiKey || "",
  };

  root.render(
    <React.StrictMode>
      <FloatingContainer />
    </React.StrictMode>,
  );
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
