import "@/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { AppContent } from "../shared/app-content";

const container = document.getElementById("app-container");
const root = createRoot(container);

const handleClose = () => {
  window.close();
};

root.render(
  <React.StrictMode>
    <AppContent onClose={handleClose} />
  </React.StrictMode>,
);
