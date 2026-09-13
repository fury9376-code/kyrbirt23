import { Router } from "express";
import { db, siteProductsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdminAuth } from "./admin-auth.js";

const router = Router();

function normalizeDiscountPercentage(value: unknown) {
  const percentage = Number(value);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

router.get("/products", async (_req, res) => {
  try {
    const rows = await db.select().from(siteProductsTable).orderBy(asc(siteProductsTable.sortOrder), asc(siteProductsTable.createdAt));
    return res.json(rows);
  } catch {
    return res.status(500).json({ error: "Failed to load products" });
  }
});

router.post("/admin/products", requireAdminAuth, async (req, res) => {
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
    req.log.error(err, "Failed to save product");
    return res.status(500).json({ error: "Failed to save product" });
  }
});

router.delete("/admin/products/:id", requireAdminAuth, async (req, res) => {
  try {
    await db.delete(siteProductsTable).where(eq(siteProductsTable.id, String(req.params.id)));
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
