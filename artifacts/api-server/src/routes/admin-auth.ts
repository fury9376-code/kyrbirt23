import type { ApiRequest, ApiResponse } from "../lib/http-types.js";

/**
 * Fail-closed admin auth middleware.
 * - 503 if ADMIN_PASSWORD env var is not configured (never fail open)
 * - 401 if header is missing or wrong
 * - passes through if correct
 */
export function requireAdminAuth(
  req: ApiRequest,
  res: ApiResponse,
  next: () => void,
) {
  const configured = process.env["ADMIN_PASSWORD"];
  if (!configured) {
    return res.status(503).json({ error: "Admin auth not configured — set ADMIN_PASSWORD secret" });
  }
  const provided = req.headers["x-admin-password"];
  if (!provided || provided !== configured) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}
