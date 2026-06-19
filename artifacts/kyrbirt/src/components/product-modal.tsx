import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Ruler } from "lucide-react";
import { type Product, type Colorway, type SizeGuideRow } from "@/data/products";
import useEmblaCarousel from "embla-carousel-react";
import { PurchaseForm } from "./purchase-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

function useGlobalSizeGuide() {
  const { data } = useQuery<SizeGuideRow[]>({
    queryKey: ["size-guide"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return [];
      const s = await res.json();
      try {
        return JSON.parse(s.size_guide || "[]");
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
  return data ?? [
    { size: "S", chest: "50", length: "70" },
    { size: "M", chest: "52", length: "72" },
    { size: "L", chest: "54", length: "74" },
    { size: "XL", chest: "56", length: "76" },
  ];
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedColorway, setSelectedColorway] = useState<Colorway | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const globalSizeGuide = useGlobalSizeGuide();

  useEffect(() => {
    if (isOpen) {
      setShowPurchaseForm(false);
      setSelectedColorway(null);
      setSelectedSize("");
    }
  }, [isOpen, product]);

  useEffect(() => {
    setSelectedSize("");
  }, [selectedColorway]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (!product) return null;

  const productSoldOut = product.soldOut || product.price === "SOLD OUT";
  const colorwaySoldOut = selectedColorway ? selectedColorway.soldOut : false;
  const allColorwaysSoldOut =
    product.colorways.length > 0 && product.colorways.every((c) => c.soldOut);

  const activeSizes = selectedColorway?.sizes?.length
    ? selectedColorway.sizes
    : product.sizes;
  const activeUnavailable = selectedColorway ? selectedColorway.unavailableSizes : [];
  const availableSizes = activeSizes.filter((s) => !activeUnavailable.includes(s));
  const allSizesUnavailable = activeSizes.length > 0 && availableSizes.length === 0;

  const buyDisabled =
    productSoldOut ||
    allColorwaysSoldOut ||
    colorwaySoldOut ||
    allSizesUnavailable;

  const sizeGuide: SizeGuideRow[] =
    (product.sizeGuide && product.sizeGuide.length > 0)
      ? product.sizeGuide
      : globalSizeGuide;

  return (
    <>
      <Dialog open={isOpen && !showPurchaseForm} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="max-w-4xl p-0 overflow-hidden bg-background border-border gap-0 rounded-none sm:rounded-md"
          data-testid={`modal-product-${product.id}`}
        >
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full transition-colors text-foreground"
            data-testid="button-close-modal"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] md:max-h-[80vh]">
            {/* Left: Carousel */}
            <div className="relative bg-card h-[50vh] md:h-auto group">
              <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {product.photos.map((photo, i) => (
                    <div key={i} className="flex-[0_0_100%] min-w-0 h-full relative bg-card">
                      {photo ? (
                        <img
                          src={photo}
                          alt={`${product.name} - Vista ${i + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              {product.photos.length > 1 && (
                <>
                  <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Right: Info */}
            <div className="p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-4xl font-display tracking-widest">{product.name}</h2>
                  <p className="text-muted-foreground text-sm mt-1 uppercase tracking-wider">{product.category}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {productSoldOut || allColorwaysSoldOut || colorwaySoldOut ? (
                    <span className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold tracking-widest">
                      SOLD OUT
                    </span>
                  ) : (
                    <span className="text-2xl font-mono">
                      ${typeof product.price === "number"
                        ? product.price.toLocaleString("es-AR")
                        : product.price}
                    </span>
                  )}
                </div>
              </div>

              {product.stock != null && !productSoldOut && (
                <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">
                  Stock:{" "}
                  <span className={product.stock <= 5 ? "text-destructive font-bold" : "text-foreground"}>
                    {product.stock} unidades
                  </span>
                </p>
              )}

              <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
                {product.description}
              </p>

              <div className="space-y-5 mb-6 mt-auto">
                {/* Colorway selector */}
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colorways.map((cw) => {
                      const isSelected = selectedColorway?.name === cw.name;
                      return (
                        <button
                          key={cw.name}
                          onClick={() => setSelectedColorway(isSelected ? null : cw)}
                          disabled={cw.soldOut}
                          className={`px-3 py-1.5 border text-sm tracking-wide transition-colors ${
                            cw.soldOut
                              ? "border-destructive/40 text-destructive/60 line-through cursor-default"
                              : isSelected
                              ? "border-primary text-primary bg-primary/10"
                              : "border-border hover:border-primary/60 text-foreground"
                          }`}
                          title={cw.soldOut ? "SOLD OUT" : undefined}
                        >
                          {cw.name}
                          {cw.soldOut && <span className="ml-1.5 text-[10px] tracking-widest">SOLD OUT</span>}
                        </button>
                      );
                    })}
                  </div>
                  {colorwaySoldOut && (
                    <p className="text-xs text-destructive tracking-wider">Este color está agotado.</p>
                  )}
                </div>

                {/* Size selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold uppercase tracking-wider">Talle</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                          <Ruler size={12} /> Guía de Talles
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-0 border-border bg-card overflow-hidden" align="end">
                        <div className="bg-card">
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-xs font-bold tracking-widest uppercase">Guía de Talles</p>
                            <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
                              {product.name} — medidas en centímetros
                            </p>
                          </div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/40">
                                <th className="py-2 px-4 text-left text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Talle</th>
                                <th className="py-2 px-4 text-center text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Sisa</th>
                                <th className="py-2 px-4 text-center text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Largo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sizeGuide.map((row, i) => (
                                <tr key={row.size + i} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                                  <td className="py-2.5 px-4">
                                    <span className="font-display tracking-wider text-base">{row.size}</span>
                                  </td>
                                  <td className="py-2.5 px-4 text-center font-mono text-sm text-muted-foreground">{row.chest} cm</td>
                                  <td className="py-2.5 px-4 text-center font-mono text-sm text-muted-foreground">{row.length} cm</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="px-4 py-2.5 border-t border-border bg-muted/20">
                            <p className="text-[10px] text-muted-foreground tracking-wide">Las medidas pueden variar ±1–2 cm según el modelo.</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {activeSizes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {activeSizes.map((size) => {
                        const isUnavailable = activeUnavailable.includes(size);
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            disabled={isUnavailable || buyDisabled}
                            onClick={() => !isUnavailable && setSelectedSize(size)}
                            className={`min-w-[44px] h-10 px-3 border text-sm font-mono tracking-wider transition-colors ${
                              isUnavailable
                                ? "border-border text-muted-foreground/40 cursor-not-allowed line-through"
                                : isSelected
                                ? "border-primary text-primary bg-primary/10"
                                : "border-border hover:border-primary/60 text-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground tracking-wider">
                      {selectedColorway
                        ? "Este color no tiene talles configurados."
                        : "Seleccioná un color para ver los talles."}
                    </p>
                  )}

                  {allSizesUnavailable && !buyDisabled && activeSizes.length > 0 && (
                    <p className="text-xs text-destructive tracking-wider">Todos los talles de este color están agotados.</p>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setShowPurchaseForm(true)}
                disabled={buyDisabled}
                className="w-full h-14 rounded-none font-display text-xl tracking-widest uppercase"
                data-testid="button-buy-init"
              >
                {buyDisabled ? "AGOTADO" : "COMPRAR"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PurchaseForm
        product={product}
        isOpen={showPurchaseForm}
        onClose={() => { setShowPurchaseForm(false); onClose(); }}
        onBack={() => setShowPurchaseForm(false)}
        initialSize={selectedSize}
        initialColor={selectedColorway?.name ?? ""}
      />
    </>
  );
}
