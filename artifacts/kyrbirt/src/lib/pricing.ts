export type DiscountSettings = {
  discount_enabled?: string;
  discount_percentage?: string;
  discount_label?: string;
};

export function getDiscountPercentage(settings: DiscountSettings): number {
  if (settings.discount_enabled !== "true") return 0;
  const percentage = Number(settings.discount_percentage);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, percentage));
}

export function hasActiveDiscount(
  price: number | "SOLD OUT",
  settings: DiscountSettings,
): boolean {
  return typeof price === "number" && getDiscountPercentage(settings) > 0;
}

export function getDiscountedPrice(
  price: number | "SOLD OUT",
  settings: DiscountSettings,
): number | "SOLD OUT" {
  if (typeof price !== "number") return price;
  const percentage = getDiscountPercentage(settings);
  return Math.max(0, Math.round(price * (1 - percentage / 100)));
}

export function formatPrice(price: number | "SOLD OUT"): string {
  return typeof price === "number"
    ? `$${price.toLocaleString("es-AR")}`
    : price;
}