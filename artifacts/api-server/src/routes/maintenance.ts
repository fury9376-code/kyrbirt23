import { Router } from "express";
import { requireAdminAuth } from "./admin-auth.js";
import type { ApiRequest, ApiResponse } from "../lib/http-types.js";

const router = Router();

let maintenanceEnabled = false;

router.get("/maintenance", (_req: ApiRequest, res: ApiResponse) => {
  res.json({ enabled: maintenanceEnabled });
});

router.post("/maintenance/enable", requireAdminAuth, (_req: ApiRequest, res: ApiResponse) => {
  maintenanceEnabled = true;
  res.json({ ok: true, enabled: true });
});

router.post("/maintenance/disable", requireAdminAuth, (_req: ApiRequest, res: ApiResponse) => {
  maintenanceEnabled = false;
  res.json({ ok: true, enabled: false });
});

export default router;
