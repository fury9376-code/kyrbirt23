import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdminAuth } from "./admin-auth";

const router = Router();

const FAM_PHOTOS_DEFAULT = JSON.stringify([
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763012/turrobaby_ppibbe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763034/pppatuka_sgyabe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763013/panchitolefleur_lzvqoe.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763011/neopistea_u1qr5p.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763005/ceroasterisco_jdk30z.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/bhaviboi_ht4rh1.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/salasfl4co_nkstmy.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763001/shako2b_ejtp9f.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777762998/luhrever_u8dj5c.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777839945/uzu.messineo_1_uax1pr.png",
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/sstiffy_v8f6ir.png",
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
  drop_bg_image: "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777763004/salasfl4co_nkstmy.png",
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

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
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
  try {
    await db
      .insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value, updatedAt: new Date() },
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
      await db
        .insert(siteSettingsTable)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettingsTable.key,
          set: { value, updatedAt: new Date() },
        });
    }
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
