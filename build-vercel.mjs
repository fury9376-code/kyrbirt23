import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));

console.log("==> Building api-server...");
execSync("pnpm --filter @workspace/api-server run build", {
  stdio: "inherit",
  cwd: root,
});

console.log("==> Building kyrbirt (Vite)...");
execSync("pnpm --filter @workspace/kyrbirt run build", {
  stdio: "inherit",
  cwd: root,
});

console.log("==> Copying static output to dist/...");
const src = resolve(root, "artifacts/kyrbirt/dist");
const dest = resolve(root, "dist");

if (!existsSync(src)) {
  console.error("ERROR: artifacts/kyrbirt/dist does not exist after build!");
  process.exit(1);
}

if (!existsSync(dest)) {
  mkdirSync(dest, { recursive: true });
}

cpSync(src, dest, { recursive: true });
console.log("==> Done. Files copied to dist/");
