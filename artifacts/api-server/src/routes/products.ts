import { Router } from "express";
import {
  asc,
  db,
  eq,
  isDatabaseConfigured,
  siteProductsTable,
  siteSettingsTable,
} from "@workspace/db";
import { requireAdminAuth } from "./admin-auth.js";
import type { ApiRequest, ApiResponse } from "../lib/http-types.js";

const router = Router();

function normalizeDiscountPercentage(value: unknown) {
  const percentage = Number(value);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

function isMissingDiscountColumn(error: unknown) {
  let current: unknown = error;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return false;
    const candidate = current as {
      code?: unknown;
      message?: unknown;
      cause?: unknown;
    };
    const message =
      typeof candidate.message === "string" ? candidate.message : "";
    if (
      (candidate.code === "42703" || message.includes("does not exist")) &&
      /discount_(enabled|percentage|label)/i.test(message)
    ) {
      return true;
    }
    current = candidate.cause;
  }
  return false;
}

const discountSettingKey = (
  productId: string,
  field: "enabled" | "percentage" | "label",
) => `product_discount:${productId}:${field}`;

async function loadLegacyProducts() {
  const rows = await db
    .select({
      id: siteProductsTable.id,
      name: siteProductsTable.name,
      description: siteProductsTable.description,
      photos: siteProductsTable.photos,
      colorways: siteProductsTable.colorways,
      price: siteProductsTable.price,
      sizes: siteProductsTable.sizes,
      unavailableSizes: siteProductsTable.unavailableSizes,
      category: siteProductsTable.category,
      subcategory: siteProductsTable.subcategory,
      locked: siteProductsTable.locked,
      available: siteProductsTable.available,
      soldOut: siteProductsTable.soldOut,
      stock: siteProductsTable.stock,
      sortOrder: siteProductsTable.sortOrder,
      createdAt: siteProductsTable.createdAt,
    })
    .from(siteProductsTable)
    .orderBy(
      asc(siteProductsTable.sortOrder),
      asc(siteProductsTable.createdAt),
    );
  const settingRows = await db.select().from(siteSettingsTable);
  const settings = new Map(settingRows.map((row) => [row.key, row.value]));
  return rows.map((row) => ({
    ...row,
    discountEnabled:
      settings.get(discountSettingKey(row.id, "enabled")) === "true",
    discountPercentage: normalizeDiscountPercentage(
      settings.get(discountSettingKey(row.id, "percentage")),
    ),
    discountLabel:
      settings.get(discountSettingKey(row.id, "label")) || "DESCUENTO",
  }));
}

function legacyProductValues(product: any) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    photos: JSON.stringify(product.photos || []),
    colorways:
      typeof product.colorways === "string"
        ? product.colorways
        : JSON.stringify(product.colorways || []),
    price: String(product.price),
    sizes: JSON.stringify(product.sizes || []),
    unavailableSizes: JSON.stringify(product.unavailableSizes || []),
    category: product.category,
    subcategory: product.subcategory || null,
    locked: product.locked || false,
    available: product.available !== false,
    soldOut: product.soldOut || false,
    stock: product.stock != null ? Number(product.stock) : null,
    sortOrder: product.sortOrder || 0,
  };
}

async function saveLegacyProduct(product: any) {
  const values = legacyProductValues(product);
  const { id: _id, ...updates } = values;
  const updated = await db
    .update(siteProductsTable)
    .set(updates)
    .where(eq(siteProductsTable.id, values.id))
    .returning({ id: siteProductsTable.id });
  if (updated.length === 0) {
    await db.insert(siteProductsTable).values(values);
  }

  const discountSettings = [
    {
      key: discountSettingKey(values.id, "enabled"),
      value: String(Boolean(product.discountEnabled)),
    },
    {
      key: discountSettingKey(values.id, "percentage"),
      value: String(normalizeDiscountPercentage(product.discountPercentage)),
    },
    {
      key: discountSettingKey(values.id, "label"),
      value:
        String(product.discountLabel || "DESCUENTO").trim() || "DESCUENTO",
    },
  ];
  for (const setting of discountSettings) {
    await db
      .insert(siteSettingsTable)
      .values({ ...setting, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value: setting.value, updatedAt: new Date() },
      });
  }
}

router.get("/products", async (_req: ApiRequest, res: ApiResponse) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({ error: "DATABASE_URL env var not configured" });
  }
  try {
    const rows = await db.select().from(siteProductsTable).orderBy(asc(siteProductsTable.sortOrder), asc(siteProductsTable.createdAt));
    return res.json(rows);
  } catch (error) {
    if (isMissingDiscountColumn(error)) {
      try {
        return res.json(await loadLegacyProducts());
      } catch {
        return res.status(500).json({ error: "Failed to load products" });
      }
    }
    return res.status(500).json({ error: "Failed to load products" });
  }
});

router.post("/admin/products", requireAdminAuth, async (req: ApiRequest, res: ApiResponse) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({ error: "DATABASE_URL env var not configured" });
  }
  const product = req.body;
  try {
    await db
      .insert(siteProductsTable)
      .values({
        id: product.id,
        name: product.name,
        description: product.description || "",
        photos: JSON.stringify(product.photos || []),
        colorways: typeof product.colorways === "string" ? product.colorways : JSON.stringify(product.colorways || []),
        price: String(product.price),
        discountEnabled: Boolean(product.discountEnabled),
        discountPercentage: normalizeDiscountPercentage(product.discountPercentage),
        discountLabel: String(product.discountLabel || "DESCUENTO").trim() || "DESCUENTO",
        sizes: JSON.stringify(product.sizes || []),
        unavailableSizes: JSON.stringify(product.unavailableSizes || []),
        category: product.category,
        subcategory: product.subcategory || null,
        locked: product.locked || false,
        available: product.available !== false,
        soldOut: product.soldOut || false,
        stock: product.stock != null ? Number(product.stock) : null,
        sortOrder: product.sortOrder || 0,
      })
      .onConflictDoUpdate({
        target: siteProductsTable.id,
        set: {
          name: product.name,
          description: product.description || "",
          photos: JSON.stringify(product.photos || []),
          colorways: typeof product.colorways === "string" ? product.colorways : JSON.stringify(product.colorways || []),
          price: String(product.price),
          discountEnabled: Boolean(product.discountEnabled),
          discountPercentage: normalizeDiscountPercentage(product.discountPercentage),
          discountLabel: String(product.discountLabel || "DESCUENTO").trim() || "DESCUENTO",
          sizes: JSON.stringify(product.sizes || []),
          unavailableSizes: JSON.stringify(product.unavailableSizes || []),
          category: product.category,
          subcategory: product.subcategory || null,
          locked: product.locked || false,
          available: product.available !== false,
          soldOut: product.soldOut || false,
          stock: product.stock != null ? Number(product.stock) : null,
          sortOrder: product.sortOrder || 0,
        },
      });
    return res.json({ ok: true });
  } catch (err: any) {
    if (isMissingDiscountColumn(err)) {
      try {
        await saveLegacyProduct(product);
        return res.json({ ok: true, legacySchema: true });
      } catch (legacyError) {
        req.log.error(legacyError, "Failed to save legacy product");
      }
    }
    req.log.error(err, "Failed to save product");
    return res.status(500).json({ error: "Failed to save product" });
  }
});

router.delete("/admin/products/:id", requireAdminAuth, async (req: ApiRequest, res: ApiResponse) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({ error: "DATABASE_URL env var not configured" });
  }
  try {
    await db.delete(siteProductsTable).where(eq(siteProductsTable.id, String(req.params.id)));
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
