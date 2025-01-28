import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  build: {
    outDir: "dist/inject",
    lib: {
      entry: path.resolve(__dirname, "src/variants/inject/index.tsx"),
      name: "App2AgentInject",
      formats: ["iife"],
      fileName: () => "inject.js",
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          // Embed the CSS into the JS bundle
          if (assetInfo.name === "style.css") {
            return "inject.js";
          }
          return "[name][extname]";
        },
      },
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
