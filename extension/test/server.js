import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Serve the test page
app.use(express.static(__dirname));
app.use("/extension/dist", express.static(path.join(__dirname, "../dist")));

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
