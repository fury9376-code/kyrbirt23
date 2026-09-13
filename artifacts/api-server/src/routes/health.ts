import { Router } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import type { ApiRequest, ApiResponse } from "../lib/http-types.js";

const router = Router();

router.get("/healthz", (_req: ApiRequest, res: ApiResponse) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
