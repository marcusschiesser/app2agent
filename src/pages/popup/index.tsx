declare const __GEMINI_API_KEY__: any;

import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import { Popup } from "./popup";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LiveAPIProvider url={uri} apiKey={__GEMINI_API_KEY__}>
      <Popup />
    </LiveAPIProvider>
  </React.StrictMode>,
);
