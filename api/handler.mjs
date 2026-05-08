import { createApp } from "../artifacts/api-server/dist/app.mjs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(__dirname, "../artifacts/kyrbirt/dist");

const app = createApp(staticDir);
export default app;
