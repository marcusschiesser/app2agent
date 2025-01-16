import "@/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { AppContent } from "../shared/app-content";

const container = document.getElementById("app-container");
if (!container) {
  throw new Error("App container not found");
}
const root = createRoot(container);

const handleClose = () => {
  window.close();
};

root.render(
  <React.StrictMode>
    <div className="w-full">
      <AppContent onClose={handleClose} />
    </div>
  </React.StrictMode>,
);
