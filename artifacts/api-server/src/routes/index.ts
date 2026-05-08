import { Router, type IRouter } from "express";
import healthRouter from "./health";
import maintenanceRouter from "./maintenance";
import ordersRouter from "./orders";
import settingsRouter from "./settings";
import productsRouter from "./products";

const router: IRouter = Router();

router.use(healthRouter);
router.use(maintenanceRouter);
router.use(ordersRouter);
router.use(settingsRouter);
router.use(productsRouter);

// Server-side admin password verification — never exposes the secret to the client
router.post("/admin/verify", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = (process.env["ADMIN_PASSWORD"] ?? "").trim();
  if (!adminPassword) {
    return res.status(503).json({ ok: false, error: "ADMIN_PASSWORD env var not configured" });
  }
  if ((password ?? "").trim() === adminPassword) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Incorrect password" });
});

export default router;
