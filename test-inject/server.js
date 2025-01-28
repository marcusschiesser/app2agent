import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Serve static files from test-inject and extension/dist
app.use(express.static(__dirname));
app.use(
  "/extension/dist",
  express.static(path.join(__dirname, "../extension/dist")),
);

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
