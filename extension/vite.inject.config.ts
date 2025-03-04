import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

console.log("Environment:", process.env.NODE_ENV);

export default defineConfig({
  build: {
    outDir: "dist/inject",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/variants/inject/index.tsx"),
      name: "App2AgentInject",
      formats: ["iife"],
      fileName: () => "inject.js",
    },
    cssCodeSplit: false,
    assetsInlineLimit: 100000000, // Inline all assets (100MB limit)
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
  define: {
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
    },
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || "production"),
    __API_KEY__: JSON.stringify(process.env.APP2AGENT_API_KEY || ""),
  },
  plugins: [
    react(),
    {
      name: "vite-plugin-css-injected-by-js",
      apply: "build",
      enforce: "post",
      generateBundle(_, bundle) {
        // This plugin ensures CSS is stored in a global  APP2AGENT_INJECT_CSS variable
        const cssChunks = Object.keys(bundle).filter((key) =>
          key.endsWith(".css"),
        );

        if (cssChunks.length > 0) {
          const jsChunks = Object.keys(bundle).filter((key) =>
            key.endsWith(".js"),
          );

          if (jsChunks.length > 0) {
            const cssCode = cssChunks
              .map((key) => bundle[key].source)
              .join("\n");

            // Store CSS as a global variable in the JS bundle instead of injecting to document.head
            const mainJsChunk = bundle[jsChunks[0]];
            const { code } = mainJsChunk;
            mainJsChunk.code = `
            window.APP2AGENT_INJECT_CSS = ${JSON.stringify(cssCode)};
            ${code}`;

            // Remove CSS chunks since they're now inlined
            cssChunks.forEach((key) => {
              delete bundle[key];
            });
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
