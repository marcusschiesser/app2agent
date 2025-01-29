import "@/index.css";
import React from "react";
import { getModalRoot } from "@/components/modal";
import { ModalApp } from "../shared/modal-app";

// Initialize the modal root
getModalRoot().then((root) => {
  root.render(
    <React.StrictMode>
      <ModalApp />
    </React.StrictMode>,
  );
});

console.log("app2agent loaded");
