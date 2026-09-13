import { Router } from "express";
import healthRouter from "./health.js";
import maintenanceRouter from "./maintenance.js";
import ordersRouter from "./orders.js";
import settingsRouter from "./settings.js";
import productsRouter from "./products.js";
import type { ApiRequest, ApiResponse } from "../lib/http-types.js";

const router = Router();

router.use(healthRouter);
router.use(maintenanceRouter);
router.use(ordersRouter);
router.use(settingsRouter);
router.use(productsRouter);

// Server-side admin password verification — never exposes the secret to the client
router.post("/admin/verify", (req: ApiRequest, res: ApiResponse) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "";
  if (!adminPassword) {
    return res.status(503).json({ ok: false, error: "ADMIN_PASSWORD env var not configured" });
  }
  if (password === adminPassword) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Incorrect password" });
});

export default router;
