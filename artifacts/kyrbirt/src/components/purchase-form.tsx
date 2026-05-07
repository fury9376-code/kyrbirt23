import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Product } from "@/data/products";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  size: z.string().min(1, { message: "Selecciona un talle" }),
  color: z.string().min(1, { message: "Selecciona un color" }),
  quantity: z.coerce.number().min(1, { message: "Mínimo 1" }).max(10),
  fullName: z.string().min(3, { message: "Ingresa tu nombre completo" }),
  phone: z.string().min(8, { message: "Teléfono inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  comments: z.string().optional(),
});

interface PurchaseFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  initialSize: string;
  initialColor: string;
}

export function PurchaseForm({ product, isOpen, onClose, onBack, initialSize, initialColor }: PurchaseFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: initialSize || "",
      color: initialColor || "",
      quantity: 1,
      fullName: "",
      phone: "",
      email: "",
      comments: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialSize) form.setValue("size", initialSize);
      if (initialColor) form.setValue("color", initialColor);
      setIsSuccess(false);
      setIsSending(false);
    }
  }, [isOpen, initialSize, initialColor, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    try {
      await fetch("/api/orders/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.name,
          price: product.price,
          ...values,
        }),
      });
    } catch {
    } finally {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => { if (isOpen) onClose(); }, 4000);
    }
  };

  const availableSizes = (() => {
    if (initialColor) {
      const cw = product.colorways.find((c) => c.name === initialColor);
      if (cw?.sizes?.length) return cw.sizes.filter((s) => !cw.unavailableSizes.includes(s));
    }
    return product.sizes;
  })();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="w-full sm:max-w-md overflow-y-auto border-l-border bg-background p-0"
        data-testid="purchase-form-sheet"
      >
        <SheetHeader className="p-6 border-b border-border text-left">
          <div className="flex items-center gap-4">
            {!isSuccess && (
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors" data-testid="button-back-to-product">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <SheetTitle className="font-display text-2xl tracking-widest">FINALIZAR COMPRA</SheetTitle>
              <p className="text-sm text-muted-foreground">{product.name}</p>
            </div>
          </div>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 flex flex-col items-center justify-center text-center h-[60vh]"
            >
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={32} />
              </div>
              <h3 className="font-display text-3xl mb-2">PEDIDO RECIBIDO</h3>
              <p className="text-muted-foreground mb-2">
                Te enviamos un mensaje de WhatsApp con todos los detalles del pago y envío.
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                Si no lo recibís en unos minutos, revisá que el número sea correcto o contactanos directamente.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="rounded-none w-full border-border"
                data-testid="button-close-success"
              >
                VOLVER A LA TIENDA
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <div className="flex justify-between items-center p-4 bg-muted mb-8 border border-border">
                <span className="font-bold tracking-wider text-sm">TOTAL A PAGAR</span>
                <span className="font-mono text-xl">
                  {typeof product.price === "number" ? `$${product.price.toLocaleString("es-AR")}` : product.price}
                </span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Talle</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-border">
                                <SelectValue placeholder="Talle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSizes.map((size) => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={10} className="rounded-none border-border" data-testid="input-quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colorway</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-border">
                              <SelectValue placeholder="Seleccionar Color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {product.colorways.filter((c) => !c.soldOut).map((cw) => (
                              <SelectItem key={cw.name} value={cw.name}>{cw.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t border-border pt-6">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Datos de Contacto</h4>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Pérez" className="rounded-none border-border" data-testid="input-full-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono (WhatsApp)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="11 1234 5678" className="rounded-none border-border" data-testid="input-phone" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Te enviaremos un mensaje a este número con los datos de pago y envío.
                            </p>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="juan@ejemplo.com" className="rounded-none border-border" data-testid="input-email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comentarios especiales (opcional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Aclaraciones para el envío o retiro..." className="rounded-none border-border min-h-[80px]" data-testid="input-comments" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full h-14 rounded-none font-display text-xl tracking-widest transition-transform active:scale-[0.98]"
                    data-testid="button-confirm-purchase"
                  >
                    {isSending ? "ENVIANDO..." : "CONFIRMAR COMPRA"}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-4">¿Preferís comprar por WhatsApp?</p>
                <a
                  href="https://wa.me/2235744381"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:bg-muted transition-colors rounded-none w-full text-sm font-bold tracking-wider"
                  data-testid="link-whatsapp-contact"
                >
                  CONTACTAR POR WHATSAPP
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
