import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const siteProductsTable = pgTable("site_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  photos: text("photos").notNull().default("[]"),
  colorways: text("colorways").notNull().default("[]"),
  price: text("price").notNull().default("0"),
  sizes: text("sizes").notNull().default("[]"),
  unavailableSizes: text("unavailable_sizes").notNull().default("[]"),
  category: text("category").notNull().default("Remeras"),
  subcategory: text("subcategory"),
  locked: boolean("locked").notNull().default(false),
  available: boolean("available").notNull().default(true),
  soldOut: boolean("sold_out").notNull().default(false),
  stock: integer("stock"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SiteProduct = typeof siteProductsTable.$inferSelect;
