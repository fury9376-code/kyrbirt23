import { useQuery } from "@tanstack/react-query";
import { products as hardcodedProducts, type Product, type Colorway } from "@/data/products";

type ApiProduct = {
  id: string;
  name: string;
  description: string;
  photos: string;
  colorways: string;
  price: string;
  sizes: string;
  unavailableSizes: string;
  category: string;
  subcategory: string | null;
  locked: boolean;
  available: boolean;
  soldOut: boolean;
  stock: number | null;
  sortOrder: number;
};

function parseColorways(raw: string, defaultSizes: string[], legacyUnavailable: string[]): Colorway[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    if (typeof parsed[0] === "string") {
      return (parsed as string[]).map((name) => ({
        name,
        sizes: defaultSizes,
        unavailableSizes: legacyUnavailable,
        soldOut: false,
      }));
    }

    return parsed as Colorway[];
  } catch {
    return [];
  }
}

function parseApiProduct(p: ApiProduct): Product {
  const price = p.price === "SOLD OUT" ? "SOLD OUT" : (Number(p.price) || (p.price as any));
  const defaultSizes = JSON.parse(p.sizes || "[]");
  const legacyUnavailable = JSON.parse(p.unavailableSizes || "[]");

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    photos: JSON.parse(p.photos || "[]"),
    colorways: parseColorways(p.colorways, defaultSizes, legacyUnavailable),
    price: price as Product["price"],
    sizes: defaultSizes,
    category: p.category as Product["category"],
    subcategory: p.subcategory ?? undefined,
    locked: p.locked,
    soldOut: p.soldOut,
    stock: p.stock,
  };
}

export function useSiteProducts() {
  const { data, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["site-products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) return hardcodedProducts;
      const rows: ApiProduct[] = await res.json();
      if (rows.length === 0) return hardcodedProducts;
      return rows.filter((p) => p.available).map(parseApiProduct);
    },
    staleTime: 30_000,
  });

  return { products: data ?? hardcodedProducts, isLoading, refetch };
}
