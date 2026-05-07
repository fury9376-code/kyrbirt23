import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { type Product } from "@/data/products";
import { useSiteProducts } from "@/hooks/use-site-products";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ProductModal } from "./product-modal";
import { Badge } from "@/components/ui/badge";
import { useDrops } from "@/hooks/use-drops";

const CATEGORIES = ["Remeras", "Pantalones", "Accesorios", "Hoodies"];
const PANTALONES_SUBCATS = ["Todos", "Shorts", "Pantalones"];
const HOODIES_SUBCATS = ["Todos", "Zip Hoodie", "Hoodie"];

function isProductSoldOut(p: Product): boolean {
  if (p.soldOut || p.price === "SOLD OUT") return true;
  if (p.colorways.length > 0 && p.colorways.every((c) => c.soldOut)) return true;
  return false;
}

export function Store() {
  const [activeCategory, setActiveCategory] = useState("Remeras");
  const [activeSubcategory, setActiveSubcategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { unlocked: dropsUnlocked } = useDrops();
  const [, setLocation] = useLocation();
  const { products } = useSiteProducts();
  const { settings } = useSiteSettings();

  const isUnlocked = typeof window !== "undefined" && window.location.search.includes("unlock=true");

  const dropLabel = settings.drop_subtitle || "Próximamente";

  useEffect(() => {
    const handler = (e: Event) => {
      const product = (e as CustomEvent).detail as Product;
      if (product) {
        setActiveCategory("Remeras");
        setSelectedProduct(product);
      }
    };
    window.addEventListener("open-mafias-tee", handler);
    return () => window.removeEventListener("open-mafias-tee", handler);
  }, []);

  const baseFiltered = products.filter((p) => {
    if (p.category !== activeCategory) return false;
    if (activeSubcategory !== "Todos" && p.subcategory !== activeSubcategory) return false;
    return true;
  });

  const sortedProducts = [...baseFiltered].sort((a, b) => {
    const aLocked = a.locked && !dropsUnlocked;
    const bLocked = b.locked && !dropsUnlocked;
    const aSoldOut = isProductSoldOut(a);
    const bSoldOut = isProductSoldOut(b);

    if (aLocked && !bLocked) return 1;
    if (!aLocked && bLocked) return -1;
    if (aSoldOut && !bSoldOut) return 1;
    if (!aSoldOut && bSoldOut) return -1;
    return 0;
  });

  const handleProductClick = (product: Product) => {
    const isLocked = product.locked && !dropsUnlocked;
    if (isLocked) {
      setLocation("/drops");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section id="tienda" className="py-24 bg-background min-h-screen" data-testid="store-section">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display tracking-widest mb-4">TIENDA</h2>
          <div className="w-12 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          {CATEGORIES.map((cat) => {
            const isDisabled = (cat === "Accesorios" || cat === "Hoodies") && !isUnlocked;
            return (
              <button
                key={cat}
                onClick={() => !isDisabled && (setActiveCategory(cat), setActiveSubcategory("Todos"))}
                disabled={isDisabled}
                className={`relative px-4 py-2 font-display text-xl tracking-wider transition-colors ${
                  isDisabled
                    ? "text-muted-foreground opacity-40 cursor-not-allowed"
                    : activeCategory === cat
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`tab-category-${cat.toLowerCase()}`}
              >
                {cat}
                {isDisabled && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 -right-8 text-[9px] scale-75 border-border"
                  >
                    PRÓXIMAMENTE
                  </Badge>
                )}
                {activeCategory === cat && !isDisabled && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeCategory === "Pantalones" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              {PANTALONES_SUBCATS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`text-sm uppercase tracking-widest pb-1 border-b transition-colors ${
                    activeSubcategory === sub
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}

          {activeCategory === "Hoodies" && isUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              {HOODIES_SUBCATS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`text-sm uppercase tracking-widest pb-1 border-b transition-colors ${
                    activeSubcategory === sub
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <AnimatePresence>
            {sortedProducts.map((product) => {
              const isLocked = product.locked && !dropsUnlocked;
              const soldOut = isProductSoldOut(product);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-card mb-2 md:mb-4">
                    <img
                      src={product.photos[0]}
                      alt={product.name}
                      loading="lazy"
                      className={`object-cover w-full h-full transition-transform duration-700 ${
                        isLocked ? "blur-md scale-105" : "group-hover:scale-105"
                      }`}
                    />

                    {isLocked && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                        <span
                          className="text-white text-xl md:text-3xl tracking-widest"
                          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
                        >
                          PRÓXIMAMENTE
                        </span>
                        <span className="text-white/60 text-[10px] md:text-xs tracking-widest mt-2 uppercase">
                          {dropLabel}
                        </span>
                      </div>
                    )}

                    {!isLocked && !soldOut && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-display text-sm md:text-xl tracking-widest text-white border border-white/30 px-4 md:px-6 py-1 md:py-2 backdrop-blur-sm">
                          VER DETALLES
                        </span>
                      </div>
                    )}

                    {soldOut && !isLocked && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-destructive text-destructive-foreground font-display px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm tracking-widest">
                        SOLD OUT
                      </div>
                    )}

                    {product.stock != null && product.stock <= 5 && !soldOut && !isLocked && (
                      <div className="absolute bottom-2 left-2 bg-background/80 text-foreground font-mono text-xs px-2 py-0.5 tracking-wider">
                        {product.stock === 0 ? "SIN STOCK" : `${product.stock} restantes`}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <h3 className="font-display text-base md:text-2xl tracking-wide truncate">
                        {isLocked ? "SOON" : product.name}
                      </h3>
                      {!isLocked && (
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                          {product.colorways.length}{" "}
                          {product.colorways.length === 1 ? "Color" : "Colores"}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {isLocked ? (
                        <span className="text-xs text-muted-foreground tracking-widest uppercase">Pronto</span>
                      ) : soldOut ? (
                        <span className="font-bold text-destructive text-sm">SOLD OUT</span>
                      ) : (
                        <span className="font-mono text-sm md:text-lg">
                          ${typeof product.price === "number"
                            ? product.price.toLocaleString("es-AR")
                            : product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No hay productos disponibles en esta categoría.
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
