export type ProductDiscount = {
  discountEnabled?: boolean;
  discountPercentage?: number;
  discountLabel?: string;
};

export function getDiscountPercentage(product: ProductDiscount): number {
  if (!product.discountEnabled) return 0;
  const percentage = Number(product.discountPercentage);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, percentage));
}

export function hasActiveDiscount(
  price: number | "SOLD OUT",
  product: ProductDiscount,
): boolean {
  return typeof price === "number" && getDiscountPercentage(product) > 0;
}

export function getDiscountedPrice(
  price: number | "SOLD OUT",
  product: ProductDiscount,
): number | "SOLD OUT" {
  if (typeof price !== "number") return price;
  const percentage = getDiscountPercentage(product);
  return Math.max(0, Math.round(price * (1 - percentage / 100)));
}

export function formatPrice(price: number | "SOLD OUT"): string {
  return typeof price === "number"
    ? `$${price.toLocaleString("es-AR")}`
    : price;
}