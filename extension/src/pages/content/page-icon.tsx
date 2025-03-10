import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App2AgentLogo from "@/components/icons/logo";

function PageIcon() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "PERMISSION_UPDATED") {
        checkPermission();
      }
    });
  }, []);

  const checkPermission = () => {
    chrome.runtime.sendMessage({ type: "CHECK_PERMISSION" }, (response) => {
      if (response && response.hasPermission) {
        setHasPermission(true);
      }
    });
  };

  const handleClick = () => {
    chrome.runtime.sendMessage({ type: "TOGGLE_PAGE_ICON" });
  };

  if (!hasPermission) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center justify-center">
      <button
        className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-100 border-0 flex items-center justify-center"
        onClick={handleClick}
      >
        <div className="w-6 h-6">
          <App2AgentLogo />
        </div>
      </button>
    </div>
  );
}

const container = document.createElement("div");
container.id = "app2agent-page-icon-root";
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <PageIcon />
  </React.StrictMode>,
);
