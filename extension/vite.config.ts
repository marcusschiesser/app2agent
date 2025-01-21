import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "node:path";

const variant = process.env.VARIANT;
if (!variant) {
  throw new Error("VARIANT environment variable is not defined");
}

// Check for API key in dev mode
if (process.env.NODE_ENV !== "production" && !process.env.APP2AGENT_API_KEY) {
  console.warn(
    "\x1b[33m⚠️  Warning: APP2AGENT_API_KEY environment variable is not set. Set it to simplify API access in development mode.\x1b[0m",
  );
}

const outDir = `dist/${variant}`;

function generateManifest() {
  const manifest = readJsonFile(`src/variants/${variant}/manifest.json`);
  const pkg = readJsonFile("package.json");
  // overwrite version from package.json
  return {
    ...manifest,
    version: pkg.version,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir,
  },
  publicDir: `public`,
  define: {
    __MANIFEST__: JSON.stringify(generateManifest()),
    __API_KEY__: JSON.stringify(process.env.APP2AGENT_API_KEY || ""),
  },
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
