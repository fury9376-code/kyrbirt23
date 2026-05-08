import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));

function run(label, cmd, cwd) {
  const dir = cwd || root;
  console.log(`\n==> ${label}`);
  console.log(`    $ ${cmd}  (in ${dir})`);
  execSync(cmd, { stdio: "inherit", cwd: dir });
  console.log(`==> ${label}: DONE`);
}

// Build api-server directly (no pnpm, avoids preinstall hook)
run(
  "Build api-server",
  "node build.mjs",
  resolve(root, "artifacts/api-server")
);

// Build kyrbirt using its own local vite binary (pnpm isolates node_modules)
run(
  "Build kyrbirt (Vite)",
  "./node_modules/.bin/vite build --config vite.config.ts",
  resolve(root, "artifacts/kyrbirt")
);

// Copy static output to dist/ at project root
console.log("\n==> Copying static output to dist/...");
const src = resolve(root, "artifacts/kyrbirt/dist");
const dest = resolve(root, "dist");

if (!existsSync(src)) {
  console.error("[FAILED] artifacts/kyrbirt/dist not found after Vite build!");
  process.exit(1);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log(`==> Copied ${src} → ${dest}`);
console.log("==> Build complete. dist/ ready for Vercel.");
