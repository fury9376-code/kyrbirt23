import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdminAuth } from "./admin-auth";

const router = Router();
const BLOCKED_CLOUDINARY_PREFIX =
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/";

const FAM_PHOTOS_DEFAULT = JSON.stringify([
  "/fam-collage.png",
]);

const SIZE_GUIDE_DEFAULT = JSON.stringify([
  { size: "S",  chest: "50", length: "70" },
  { size: "M",  chest: "52", length: "72" },
  { size: "L",  chest: "54", length: "74" },
  { size: "XL", chest: "56", length: "76" },
]);

const DEFAULTS: Record<string, string> = {
  drop_name: "DROP 5",
  drop_target_date: "2026-05-08T23:00:00.000Z",
  drop_bg_image: "",
  drop_subtitle: "Viernes 8 de Mayo — 20:00 hs Argentina",
  footer_description: "Argentine streetwear brand. Built around street culture, local artists, and limited drops. Real recognizes real.",
  footer_instagram: "https://www.instagram.com/kyrbirt/",
  footer_whatsapp: "https://wa.me/2235744381",
  footer_payment_methods: "EFECTIVO,TRANSFERENCIA,MERCADOPAGO",
  footer_credits: "Diseñado por @_nico.esteban",
  fam_photos: FAM_PHOTOS_DEFAULT,
  contact_phone: "+54 223 574-4381",
  contact_whatsapp: "2235744381",
  contact_address: "",
  contact_email: "",
  contact_hours: "",
  contact_instagram: "kyrbirt",
  size_guide: SIZE_GUIDE_DEFAULT,
};

function normalizeSettingValue(key: string, value: unknown): string {
  const raw = String(value ?? "");
  return raw;
}

function replaceBlockedMedia(settings: Record<string, string>) {
  if (settings.drop_bg_image.startsWith(BLOCKED_CLOUDINARY_PREFIX)) {
    settings.drop_bg_image = "";
  }
  try {
    const photos = JSON.parse(settings.fam_photos);
    if (
      Array.isArray(photos) &&
      photos.length > 0 &&
      photos.every(
        (photo) =>
          typeof photo !== "string" ||
          photo.startsWith(BLOCKED_CLOUDINARY_PREFIX),
      )
    ) {
      settings.fam_photos = FAM_PHOTOS_DEFAULT;
    }
  } catch {
    settings.fam_photos = FAM_PHOTOS_DEFAULT;
  }
}

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    replaceBlockedMedia(settings);
    return res.json(settings);
  } catch {
    return res.status(500).json({ error: "Failed to load settings" });
  }
});

router.post("/admin/settings", requireAdminAuth, async (req, res) => {
  const { key, value } = req.body as { key: string; value: string };
  if (!key || value === undefined) {
    return res.status(400).json({ error: "key and value required" });
  }
  const normalizedValue = normalizeSettingValue(key, value);
  try {
    await db
      .insert(siteSettingsTable)
      .values({ key, value: normalizedValue, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value: normalizedValue, updatedAt: new Date() },
      });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to save setting" });
  }
});

router.post("/admin/settings/batch", requireAdminAuth, async (req, res) => {
  const updates = req.body as Record<string, string>;
  try {
    for (const [key, value] of Object.entries(updates)) {
      const normalizedValue = normalizeSettingValue(key, value);
      await db
        .insert(siteSettingsTable)
        .values({ key, value: normalizedValue, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettingsTable.key,
          set: { value: normalizedValue, updatedAt: new Date() },
        });
    }
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
