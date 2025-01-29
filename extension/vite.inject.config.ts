import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

console.log("NODE_ENV:", process.env.NODE_ENV);

export default defineConfig({
  build: {
    outDir: "dist/inject",
    lib: {
      entry: path.resolve(__dirname, "src/variants/inject/index.tsx"),
      name: "App2AgentInject",
      formats: ["iife"],
      fileName: () => "inject.js",
    },
    cssCodeSplit: false,
  },
  define: {
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
    },
    __API_KEY__: JSON.stringify(process.env.APP2AGENT_API_KEY || ""),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
