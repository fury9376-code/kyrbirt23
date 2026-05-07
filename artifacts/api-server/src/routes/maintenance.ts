import { Router } from "express";
import { requireAdminAuth } from "./admin-auth";

const router = Router();

let maintenanceEnabled = false;

router.get("/maintenance", (_req, res) => {
  res.json({ enabled: maintenanceEnabled });
});

router.post("/maintenance/enable", requireAdminAuth, (req, res) => {
  maintenanceEnabled = true;
  res.json({ ok: true, enabled: true });
});

router.post("/maintenance/disable", requireAdminAuth, (req, res) => {
  maintenanceEnabled = false;
  res.json({ ok: true, enabled: false });
});

export default router;
