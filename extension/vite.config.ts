import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "node:path";

const variant = process.env.VARIANT;
if (!variant) {
  throw new Error("VARIANT environment variable is not defined");
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
  publicDir: `public/${variant}`,
  define: {
    __MANIFEST__: JSON.stringify(generateManifest()),
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
