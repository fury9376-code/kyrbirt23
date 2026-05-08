import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));

function run(label, cmd) {
  console.log(`\n==> ${label}`);
  console.log(`    $ ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit", cwd: root });
    console.log(`==> ${label}: OK`);
  } catch (err) {
    console.error(`\n[FAILED] ${label}`);
    console.error(`Exit code: ${err.status}`);
    process.exit(1);
  }
}

run("Build api-server", "pnpm --filter @workspace/api-server run build");
run("Build kyrbirt (Vite)", "pnpm --filter @workspace/kyrbirt run build");

console.log("\n==> Copying static output to dist/...");
const src = resolve(root, "artifacts/kyrbirt/dist");
const dest = resolve(root, "dist");

if (!existsSync(src)) {
  console.error("[FAILED] artifacts/kyrbirt/dist does not exist after Vite build!");
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("==> Done. dist/ is ready for Vercel.");
