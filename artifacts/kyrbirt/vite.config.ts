import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isReplit = !!process.env.REPL_ID;

export default defineConfig(async ({ command }) => {
  const isDev = command === "serve";
  const rawPort = process.env.PORT;
  const basePath = process.env.BASE_PATH ?? "/";

  // PORT and BASE_PATH are only required in Replit dev mode.
  // Vercel build and standard `npm run build` don't need them.
  if (isReplit && isDev && !rawPort) {
    throw new Error("PORT environment variable is required in Replit dev but was not provided.");
  }
  if (isReplit && isDev && !process.env.BASE_PATH) {
    throw new Error("BASE_PATH environment variable is required in Replit dev but was not provided.");
  }

  const port = rawPort ? Number(rawPort) : 5173;

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      ...(isReplit && isDev
        ? [
            (await import("@replit/vite-plugin-runtime-error-modal")).default(),
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer({ root: path.resolve(import.meta.dirname, "..") })
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner()
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: process.env.VERCEL
        ? path.resolve(import.meta.dirname, "../../dist")
        : path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: { strict: true },
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
