const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const publicAsset = (fileName: string) => `${baseUrl}${fileName}`;

export const BRAND_LOGO_URL = publicAsset("brand-logo.png");
export const FAM_FALLBACK_URL = publicAsset("fam-collage.png");
export const PRODUCT_FALLBACK_URL = publicAsset("product-placeholder.svg");

const BLOCKED_CLOUDINARY_PREFIX =
  "https://res.cloudinary.com/dwcjuvdtn/image/upload/";

export function resolveMediaUrl(
  value: unknown,
  fallback = PRODUCT_FALLBACK_URL,
): string {
  if (typeof value !== "string") return fallback;
  const url = value.trim();
  if (!url || url.startsWith(BLOCKED_CLOUDINARY_PREFIX)) return fallback;
  return url;
}