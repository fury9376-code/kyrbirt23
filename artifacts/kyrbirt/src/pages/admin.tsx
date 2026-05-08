import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock, LogOut, RefreshCw, ArrowLeft, ShoppingBag, Clock, Wrench, AlignLeft,
  Plus, Trash2, Save, Eye, EyeOff, Package, ChevronDown, ChevronUp, X,
  Phone, Ruler
} from "lucide-react";
import { Link } from "wouter";
import { type Product, type Colorway } from "@/data/products";
import { products as hardcodedProducts } from "@/data/products";

const CATEGORIES = ["Remeras", "Pantalones", "Accesorios", "Hoodies"];
const SUBCATEGORIES: Record<string, string[]> = {
  Pantalones: ["Shorts", "Pantalones"],
  Hoodies: ["Zip Hoodie", "Hoodie"],
};

type Order = {
  id: number; product: string; price: string; size: string; color: string;
  quantity: number; fullName: string; phone: string; email: string;
  comments: string | null; createdAt: string;
};

type ApiProduct = {
  id: string; name: string; description: string; photos: string; colorways: string;
  price: string; sizes: string; unavailableSizes: string; category: string;
  subcategory: string | null; locked: boolean; available: boolean;
  soldOut: boolean; stock: number | null; sortOrder: number;
};

type Settings = Record<string, string>;
type Tab = "orders" | "products" | "drop" | "maintenance" | "footer" | "fam" | "contacto" | "talles";

let _sessionPassword = "";

function adminFetch(path: string, opts?: RequestInit) {
  return fetch(path, {
    ...opts,
    headers: { "x-admin-password": _sessionPassword, "Content-Type": "application/json", ...(opts?.headers ?? {}) },
  });
}

async function seedProductsIfEmpty(apiProducts: ApiProduct[]) {
  if (apiProducts.length > 0) return;
  for (let i = 0; i < hardcodedProducts.length; i++) {
    const p = hardcodedProducts[i];
    await adminFetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        ...p,
        price: String(p.price),
        colorways: JSON.stringify(p.colorways),
        sortOrder: i,
      }),
    });
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ loading, onClick, label = "GUARDAR" }: { loading?: boolean; onClick: () => void; label?: string }) {
  return (
    <Button onClick={onClick} disabled={loading} className="rounded-none font-display tracking-widest gap-2">
      <Save size={14} /> {loading ? "GUARDANDO..." : label}
    </Button>
  );
}

// ─── Tab: Órdenes ────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchOrders = async () => {
    setLoading(true); setFetchError(false);
    try {
      const res = await adminFetch("/api/admin/orders");
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch { setFetchError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const fmt = (iso: string) => new Date(iso).toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground tracking-wider">
          {loading ? "Cargando..." : `${orders.length} orden${orders.length !== 1 ? "es" : ""}`}
        </p>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted transition-colors text-sm tracking-wider">
          <RefreshCw size={14} /> ACTUALIZAR
        </button>
      </div>
      {fetchError && <div className="border border-destructive p-4 text-destructive text-sm text-center mb-6">Error al cargar las órdenes.</div>}
      {!loading && !fetchError && orders.length === 0 && (
        <div className="border border-border p-16 text-center text-muted-foreground text-sm tracking-widest uppercase">No hay órdenes todavía.</div>
      )}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border bg-card p-6" data-testid={`order-card-${order.id}`}>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <span className="font-display text-xl tracking-widest">{order.product}</span>
                <span className="ml-3 text-xs text-muted-foreground">#{order.id}</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg">{order.price}</p>
                <p className="text-xs text-muted-foreground">{fmt(order.createdAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Talle</p><p>{order.size}</p></div>
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Color</p><p>{order.color}</p></div>
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Cantidad</p><p>{order.quantity}</p></div>
            </div>
            <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Nombre</p><p>{order.fullName}</p></div>
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Teléfono</p><a href={`tel:${order.phone}`} className="hover:text-primary">{order.phone}</a></div>
              <div><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Email</p><a href={`mailto:${order.email}`} className="hover:text-primary">{order.email}</a></div>
              {order.comments && <div className="md:col-span-3"><p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Comentarios</p><p className="text-muted-foreground">{order.comments}</p></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Colorway Editor ──────────────────────────────────────────────────────────
function ColorwayEditor({
  colorway, globalSizes, onChange, onDelete,
}: {
  colorway: Colorway; globalSizes: string[];
  onChange: (cw: Colorway) => void; onDelete: () => void;
}) {
  const set = (key: keyof Colorway, val: any) => onChange({ ...colorway, [key]: val });
  const allSizes = colorway.sizes.length > 0 ? colorway.sizes : globalSizes;

  const toggleUnavailable = (size: string) => {
    const cur = colorway.unavailableSizes ?? [];
    if (cur.includes(size)) {
      set("unavailableSizes", cur.filter((s) => s !== size));
    } else {
      set("unavailableSizes", [...cur, size]);
    }
  };

  const updateSizes = (raw: string) => {
    set("sizes", raw.split(",").map((s) => s.trim()).filter(Boolean));
  };

  return (
    <div className="border border-border bg-background p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Input
          className="rounded-none flex-1 h-8 text-sm"
          value={colorway.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Nombre del color"
        />
        <button onClick={onDelete} className="p-1.5 text-destructive/60 hover:text-destructive transition-colors shrink-0" title="Eliminar color">
          <Trash2 size={14} />
        </button>
      </div>

      <div>
        <label className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1 block">
          Talles (separados por coma — vacío = usa los del producto)
        </label>
        <Input
          className="rounded-none h-8 text-sm"
          value={colorway.sizes.join(", ")}
          onChange={(e) => updateSizes(e.target.value)}
          placeholder={globalSizes.join(", ")}
        />
      </div>

      {allSizes.length > 0 && (
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5 block">
            Talles sin stock (tachados)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allSizes.map((s) => {
              const isUnavail = (colorway.unavailableSizes ?? []).includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleUnavailable(s)}
                  className={`h-7 px-2.5 border text-xs font-mono transition-colors ${
                    isUnavail
                      ? "border-destructive text-destructive bg-destructive/10 line-through"
                      : "border-border text-muted-foreground hover:border-destructive/60"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={colorway.soldOut}
          onChange={(e) => set("soldOut", e.target.checked)}
          className="w-4 h-4 accent-red-500"
        />
        <span className="text-xs tracking-widest uppercase text-destructive font-medium">SOLD OUT este color</span>
      </label>
    </div>
  );
}

// ─── Product Draft ────────────────────────────────────────────────────────────
type ProductDraft = {
  id: string; name: string; description: string;
  photos: string[]; colorways: Colorway[]; price: string;
  sizes: string[]; category: string; subcategory: string;
  locked: boolean; available: boolean; soldOut: boolean; stock: string; sortOrder: number;
};

function emptyDraft(sortOrder = 0): ProductDraft {
  return {
    id: "", name: "", description: "", photos: [""],
    colorways: [{ name: "", sizes: [], unavailableSizes: [], soldOut: false }],
    price: "0", sizes: ["S", "M", "L"], category: "Remeras", subcategory: "",
    locked: false, available: true, soldOut: false, stock: "", sortOrder,
  };
}

function parseColorways(raw: string, defaultSizes: string[]): Colorway[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (typeof parsed[0] === "string") {
      return (parsed as string[]).map((name) => ({
        name, sizes: defaultSizes, unavailableSizes: [], soldOut: false,
      }));
    }
    return parsed as Colorway[];
  } catch { return []; }
}

function productToApiDraft(p: ApiProduct): ProductDraft {
  const defaultSizes = JSON.parse(p.sizes || "[]");
  return {
    id: p.id, name: p.name, description: p.description,
    photos: JSON.parse(p.photos || "[]"),
    colorways: parseColorways(p.colorways, defaultSizes),
    price: p.price,
    sizes: defaultSizes,
    category: p.category, subcategory: p.subcategory || "",
    locked: p.locked, available: p.available,
    soldOut: p.soldOut,
    stock: p.stock != null ? String(p.stock) : "",
    sortOrder: p.sortOrder,
  };
}

// ─── Product Form ─────────────────────────────────────────────────────────────
function ProductForm({ draft, onChange, onSave, onDelete, saving, isNew }: {
  draft: ProductDraft; onChange: (d: ProductDraft) => void;
  onSave: () => void; onDelete?: () => void; saving: boolean; isNew: boolean;
}) {
  const set = (key: keyof ProductDraft, val: any) => onChange({ ...draft, [key]: val });
  const updateArr = (arr: string[], i: number, val: string) => arr.map((v, j) => j === i ? val : v);
  const addItem = (arr: string[]) => [...arr, ""];
  const removeItem = (arr: string[], i: number) => arr.filter((_, j) => j !== i);

  const addColorway = () => {
    set("colorways", [...draft.colorways, { name: "", sizes: [], unavailableSizes: [], soldOut: false }]);
  };

  const updateColorway = (i: number, cw: Colorway) => {
    set("colorways", draft.colorways.map((c, j) => j === i ? cw : c));
  };

  const removeColorway = (i: number) => {
    set("colorways", draft.colorways.filter((_, j) => j !== i));
  };

  return (
    <div className="border border-border bg-card p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="ID (slug único)">
          <Input className="rounded-none" value={draft.id} disabled={!isNew}
            onChange={(e) => set("id", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="nombre-del-producto" />
        </Field>
        <Field label="Nombre">
          <Input className="rounded-none" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="NOMBRE DEL PRODUCTO" />
        </Field>
      </div>

      <Field label="Descripción">
        <Textarea className="rounded-none" value={draft.description} onChange={(e) => set("description", e.target.value)} rows={2} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Precio">
          <Input className="rounded-none" value={draft.price} onChange={(e) => set("price", e.target.value)} placeholder="25000" />
        </Field>
        <Field label="Stock total (vacío = ilimitado)">
          <Input className="rounded-none" type="number" min="0" value={draft.stock} onChange={(e) => set("stock", e.target.value)} placeholder="Ej: 10" />
        </Field>
        <Field label="Categoría">
          <select
            className="w-full h-10 border border-border bg-background px-3 text-sm rounded-none"
            value={draft.category}
            onChange={(e) => onChange({ ...draft, category: e.target.value, subcategory: "" })}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        {SUBCATEGORIES[draft.category] && (
          <Field label="Subcategoría">
            <select
              className="w-full h-10 border border-border bg-background px-3 text-sm rounded-none"
              value={draft.subcategory}
              onChange={(e) => set("subcategory", e.target.value)}
            >
              <option value="">—</option>
              {SUBCATEGORIES[draft.category].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        )}
      </div>

      <Field label="Fotos (URLs)">
        <div className="space-y-2">
          {draft.photos.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input className="rounded-none flex-1" value={url} onChange={(e) => set("photos", updateArr(draft.photos, i, e.target.value))} placeholder="https://..." />
              {draft.photos.length > 1 && (
                <button onClick={() => set("photos", removeItem(draft.photos, i))} className="p-2 border border-border hover:bg-destructive/10 text-destructive"><X size={14} /></button>
              )}
            </div>
          ))}
          <button onClick={() => set("photos", addItem(draft.photos))} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary flex items-center gap-1"><Plus size={12} /> Agregar foto</button>
        </div>
      </Field>

      <Field label="Talles base del producto (plantilla para los colores)">
        <div className="flex flex-wrap gap-2 mb-2">
          {draft.sizes.map((s, i) => (
            <div key={i} className="flex gap-1 items-center">
              <Input className="rounded-none w-16 h-8 text-sm text-center" value={s} onChange={(e) => set("sizes", updateArr(draft.sizes, i, e.target.value))} />
              {draft.sizes.length > 1 && <button onClick={() => set("sizes", removeItem(draft.sizes, i))} className="text-destructive/60 hover:text-destructive"><X size={12} /></button>}
            </div>
          ))}
          <button onClick={() => set("sizes", addItem(draft.sizes))} className="h-8 px-2 border border-dashed border-border text-xs hover:border-primary"><Plus size={12} /></button>
        </div>
        <p className="text-xs text-muted-foreground">Si un color no especifica sus propios talles, usa estos.</p>
      </Field>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs tracking-widest uppercase text-muted-foreground">Colores / Colorways ({draft.colorways.length})</label>
          <button onClick={addColorway} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary flex items-center gap-1">
            <Plus size={12} /> Agregar color
          </button>
        </div>
        <div className="space-y-3">
          {draft.colorways.map((cw, i) => (
            <ColorwayEditor key={i} colorway={cw} globalSizes={draft.sizes} onChange={(updated) => updateColorway(i, updated)} onDelete={() => removeColorway(i)} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-center">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={draft.locked} onChange={(e) => set("locked", e.target.checked)} className="w-4 h-4" />
          <span className="text-sm tracking-wider uppercase">Bloqueado (drop)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={draft.available} onChange={(e) => set("available", e.target.checked)} className="w-4 h-4" />
          <span className="text-sm tracking-wider uppercase">Visible en tienda</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={draft.soldOut} onChange={(e) => set("soldOut", e.target.checked)} className="w-4 h-4 accent-red-500" />
          <span className="text-sm tracking-wider uppercase text-destructive">SOLD OUT (todo el producto)</span>
        </label>
        <Field label="Orden">
          <Input className="rounded-none w-20" type="number" value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <SaveBtn loading={saving} onClick={onSave} label={isNew ? "CREAR PRODUCTO" : "GUARDAR CAMBIOS"} />
        {!isNew && onDelete && (
          <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 transition-colors text-sm tracking-wider">
            <Trash2 size={14} /> ELIMINAR
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Productos ───────────────────────────────────────────────────────────
function ProductsTab() {
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newDraft, setNewDraft] = useState<ProductDraft | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ProductDraft>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [seeded, setSeeded] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const rows: ApiProduct[] = await res.json();
      if (rows.length === 0 && !seeded) {
        await seedProductsIfEmpty(rows);
        setSeeded(true);
        const res2 = await fetch("/api/products");
        const rows2: ApiProduct[] = await res2.json();
        setApiProducts(rows2);
        const d: Record<string, ProductDraft> = {};
        rows2.forEach((p) => { d[p.id] = productToApiDraft(p); });
        setDrafts(d);
      } else {
        setApiProducts(rows);
        const d: Record<string, ProductDraft> = {};
        rows.forEach((p) => { d[p.id] = productToApiDraft(p); });
        setDrafts(d);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);

  const saveProduct = async (draft: ProductDraft) => {
    setSaving(draft.id);
    try {
      await adminFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          colorways: JSON.stringify(draft.colorways),
          stock: draft.stock !== "" ? Number(draft.stock) : null,
        }),
      });
      showToast("Guardado ✓");
      loadProducts();
    } catch { showToast("Error al guardar"); }
    finally { setSaving(null); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setSaving(id);
    try {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      showToast("Eliminado ✓");
      setExpanded(null);
      loadProducts();
    } finally { setSaving(null); }
  };

  const createProduct = async () => {
    if (!newDraft) return;
    if (!newDraft.id || !newDraft.name) { showToast("ID y nombre son obligatorios"); return; }
    setSaving("new");
    try {
      await adminFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...newDraft,
          colorways: JSON.stringify(newDraft.colorways),
          stock: newDraft.stock !== "" ? Number(newDraft.stock) : null,
        }),
      });
      showToast("Producto creado ✓");
      setNewDraft(null);
      loadProducts();
    } finally { setSaving(null); }
  };

  if (loading) return <div className="text-center py-16 text-muted-foreground tracking-widest">Cargando productos...</div>;

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border px-4 py-3 text-sm tracking-wider shadow-lg">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{apiProducts.length} producto{apiProducts.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setNewDraft(emptyDraft(apiProducts.length))} className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted transition-colors text-sm tracking-wider">
          <Plus size={14} /> NUEVO PRODUCTO
        </button>
      </div>

      {newDraft && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs tracking-widest uppercase text-primary">Nuevo producto</span>
            <button onClick={() => setNewDraft(null)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <ProductForm draft={newDraft} onChange={setNewDraft} onSave={createProduct} saving={saving === "new"} isNew />
        </div>
      )}

      <div className="space-y-3">
        {apiProducts.map((p) => {
          const draft = drafts[p.id] ?? productToApiDraft(p);
          const isOpen = expanded === p.id;
          const colorways = parseColorways(p.colorways, JSON.parse(p.sizes || "[]"));
          return (
            <div key={p.id} className="border border-border">
              <button
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : p.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {p.photos && JSON.parse(p.photos)[0] && (
                    <img src={JSON.parse(p.photos)[0]} alt="" className="w-10 h-10 object-cover shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-display tracking-wide truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.category}{p.subcategory ? ` · ${p.subcategory}` : ""} · {colorways.length} color{colorways.length !== 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {p.soldOut && <span className="text-xs px-2 py-0.5 border border-destructive/40 text-destructive">SOLD OUT</span>}
                  {colorways.some((c) => c.soldOut) && !p.soldOut && (
                    <span className="text-xs px-2 py-0.5 border border-destructive/30 text-destructive/70">Colores S.O.</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 border ${p.available ? "border-green-500/40 text-green-500" : "border-muted text-muted-foreground"}`}>
                    {p.available ? "Visible" : "Oculto"}
                  </span>
                  <span className="font-mono text-sm">{p.price === "SOLD OUT" ? "—" : `$${Number(p.price).toLocaleString("es-AR")}`}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-border">
                  <ProductForm
                    draft={draft}
                    onChange={(d) => setDrafts({ ...drafts, [p.id]: d })}
                    onSave={() => saveProduct(draft)}
                    onDelete={() => deleteProduct(p.id)}
                    saving={saving === p.id}
                    isNew={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Drop / Timer ────────────────────────────────────────────────────────
function DropTab({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const [form, setForm] = useState({
    drop_name: settings.drop_name ?? "DROP 5",
    drop_target_date: settings.drop_target_date ?? "2026-05-08T23:00:00.000Z",
    drop_bg_image: settings.drop_bg_image ?? "",
    drop_subtitle: settings.drop_subtitle ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm({
      drop_name: settings.drop_name ?? "DROP 5",
      drop_target_date: settings.drop_target_date ?? "2026-05-08T23:00:00.000Z",
      drop_bg_image: settings.drop_bg_image ?? "",
      drop_subtitle: settings.drop_subtitle ?? "",
    });
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings/batch", { method: "POST", body: JSON.stringify(form) });
      onSaved();
    } finally { setSaving(false); }
  };

  const localDateValue = (() => {
    try {
      const d = new Date(form.drop_target_date);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch { return ""; }
  })();

  return (
    <div className="space-y-6 max-w-lg">
      <Field label="Nombre del Drop">
        <Input className="rounded-none" value={form.drop_name} onChange={(e) => set("drop_name", e.target.value)} placeholder="DROP 5" />
      </Field>
      <Field label="Fecha y hora del Drop (hora local)">
        <Input
          className="rounded-none"
          type="datetime-local"
          value={localDateValue}
          onChange={(e) => {
            const local = new Date(e.target.value);
            set("drop_target_date", local.toISOString());
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">UTC guardado: {form.drop_target_date}</p>
      </Field>
      <Field label="Subtítulo del Timer (también aparece en los productos bloqueados)">
        <Input className="rounded-none" value={form.drop_subtitle} onChange={(e) => set("drop_subtitle", e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Ej: "Viernes 8 de Mayo — 20:00 hs Argentina"</p>
      </Field>
      <Field label="URL Imagen de Fondo del Cronómetro">
        <Input className="rounded-none" value={form.drop_bg_image} onChange={(e) => set("drop_bg_image", e.target.value)} placeholder="https://..." />
        {form.drop_bg_image && (
          <img src={form.drop_bg_image} alt="preview" className="mt-3 h-32 w-full object-cover opacity-70" />
        )}
      </Field>
      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

// ─── Tab: Mantenimiento ───────────────────────────────────────────────────────
function MaintenanceTab() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch("/api/maintenance");
    const data = await res.json();
    setEnabled(data.enabled);
  };

  useEffect(() => { fetchStatus(); }, []);

  const toggle = async (enable: boolean) => {
    setLoading(true);
    try {
      await adminFetch(`/api/maintenance/${enable ? "enable" : "disable"}`, { method: "POST" });
      setEnabled(enable);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md">
      <div className="border border-border p-8 bg-card text-center space-y-6">
        <div className={`w-20 h-20 mx-auto border-2 flex items-center justify-center text-3xl ${enabled ? "border-destructive" : "border-green-500"}`}>
          {enabled ? <EyeOff size={32} className="text-destructive" /> : <Eye size={32} className="text-green-500" />}
        </div>
        <div>
          <p className="font-display text-2xl tracking-widest mb-2">
            {enabled === null ? "Cargando..." : enabled ? "MODO MANTENIMIENTO ACTIVO" : "SITIO VISIBLE"}
          </p>
          <p className="text-sm text-muted-foreground">
            {enabled ? 'El sitio muestra la pantalla "Volvemos Pronto" a los visitantes.' : "El sitio está visible para todos los visitantes."}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => toggle(false)}
            disabled={loading || enabled === false}
            className={`px-6 py-3 border text-sm tracking-widest uppercase transition-colors ${!enabled ? "border-green-500 text-green-500" : "border-border text-muted-foreground hover:border-green-500 hover:text-green-500"}`}
          >
            HABILITAR SITIO
          </button>
          <button
            onClick={() => toggle(true)}
            disabled={loading || enabled === true}
            className={`px-6 py-3 border text-sm tracking-widest uppercase transition-colors ${enabled ? "border-destructive text-destructive" : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"}`}
          >
            ACTIVAR MANTENIMIENTO
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Footer ──────────────────────────────────────────────────────────────
function FooterTab({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const [form, setForm] = useState({
    footer_description: settings.footer_description ?? "",
    footer_instagram: settings.footer_instagram ?? "",
    footer_whatsapp: settings.footer_whatsapp ?? "",
    footer_payment_methods: settings.footer_payment_methods ?? "",
    footer_credits: settings.footer_credits ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm({
      footer_description: settings.footer_description ?? "",
      footer_instagram: settings.footer_instagram ?? "",
      footer_whatsapp: settings.footer_whatsapp ?? "",
      footer_payment_methods: settings.footer_payment_methods ?? "",
      footer_credits: settings.footer_credits ?? "",
    });
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings/batch", { method: "POST", body: JSON.stringify(form) });
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-lg">
      <Field label="Descripción de la marca">
        <Textarea className="rounded-none" rows={3} value={form.footer_description} onChange={(e) => set("footer_description", e.target.value)} />
      </Field>
      <Field label="URL Instagram">
        <Input className="rounded-none" value={form.footer_instagram} onChange={(e) => set("footer_instagram", e.target.value)} placeholder="https://www.instagram.com/..." />
      </Field>
      <Field label="URL WhatsApp (wa.me/...)">
        <Input className="rounded-none" value={form.footer_whatsapp} onChange={(e) => set("footer_whatsapp", e.target.value)} placeholder="https://wa.me/..." />
      </Field>
      <Field label="Métodos de pago (separados por coma)">
        <Input className="rounded-none" value={form.footer_payment_methods} onChange={(e) => set("footer_payment_methods", e.target.value)} placeholder="EFECTIVO,TRANSFERENCIA,MERCADOPAGO" />
      </Field>
      <Field label="Créditos de diseño">
        <Input className="rounded-none" value={form.footer_credits} onChange={(e) => set("footer_credits", e.target.value)} placeholder="Diseñado por @..." />
      </Field>
      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

// ─── Tab: FAM ─────────────────────────────────────────────────────────────────
function FamTab({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  useEffect(() => {
    try {
      const parsed = JSON.parse(settings.fam_photos || "[]");
      setPhotos(Array.isArray(parsed) ? parsed : []);
    } catch { setPhotos([]); }
  }, [settings]);

  const save = async (newPhotos: string[]) => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ key: "fam_photos", value: JSON.stringify(newPhotos) }),
      });
      onSaved();
      showToast("FAM actualizado ✓");
    } catch { showToast("Error al guardar"); }
    finally { setSaving(false); }
  };

  const addPhoto = () => {
    const url = newUrl.trim();
    if (!url) return;
    const updated = [...photos, url];
    setPhotos(updated);
    setNewUrl("");
    save(updated);
  };

  const removePhoto = (i: number) => {
    const updated = photos.filter((_, j) => j !== i);
    setPhotos(updated);
    save(updated);
  };

  const movePhoto = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const updated = [...photos];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setPhotos(updated);
    save(updated);
  };

  return (
    <div className="max-w-2xl">
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-card border border-border px-4 py-3 text-sm tracking-wider shadow-lg">{toast}</div>}
      <p className="text-sm text-muted-foreground mb-6">{photos.length} foto{photos.length !== 1 ? "s" : ""} en la sección FAM</p>
      <div className="border border-border p-4 mb-6 space-y-3">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">Agregar foto (URL de Cloudinary u otro host)</p>
        <div className="flex gap-2">
          <Input
            className="rounded-none flex-1" value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            onKeyDown={(e) => e.key === "Enter" && addPhoto()}
          />
          <Button onClick={addPhoto} disabled={saving || !newUrl.trim()} className="rounded-none gap-2 shrink-0">
            <Plus size={14} /> AGREGAR
          </Button>
        </div>
        {newUrl && (
          <img src={newUrl} alt="preview" className="h-24 object-cover opacity-80 mt-2" onError={(e) => (e.currentTarget.style.display = "none")} />
        )}
      </div>
      <div className="space-y-3">
        {photos.length === 0 && (
          <div className="border border-dashed border-border p-12 text-center text-muted-foreground text-sm tracking-widest">No hay fotos. Agregá la primera foto arriba.</div>
        )}
        {photos.map((url, i) => (
          <div key={i} className="border border-border bg-card flex items-center gap-3 p-3">
            <img src={url} alt={`FAM ${i + 1}`} className="w-16 h-16 object-cover shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.background = "#333"; }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{url}</p>
              <p className="text-xs tracking-widest text-muted-foreground/60 mt-0.5">Foto #{i + 1}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => movePhoto(i, -1)} disabled={i === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronUp size={14} /></button>
              <button onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronDown size={14} /></button>
            </div>
            <button onClick={() => removePhoto(i)} className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Contacto ────────────────────────────────────────────────────────────
function ContactoTab({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const [form, setForm] = useState({
    contact_phone: settings.contact_phone ?? "",
    contact_whatsapp: settings.contact_whatsapp ?? "",
    contact_email: settings.contact_email ?? "",
    contact_address: settings.contact_address ?? "",
    contact_hours: settings.contact_hours ?? "",
    contact_instagram: settings.contact_instagram ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm({
      contact_phone: settings.contact_phone ?? "",
      contact_whatsapp: settings.contact_whatsapp ?? "",
      contact_email: settings.contact_email ?? "",
      contact_address: settings.contact_address ?? "",
      contact_hours: settings.contact_hours ?? "",
      contact_instagram: settings.contact_instagram ?? "",
    });
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings/batch", { method: "POST", body: JSON.stringify(form) });
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-lg">
      <p className="text-sm text-muted-foreground tracking-wide mb-2">Esta información aparece en la sección de contacto del sitio.</p>
      <Field label="Teléfono (para mostrar)">
        <Input className="rounded-none" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="+54 223 574-4381" />
      </Field>
      <Field label="Número WhatsApp (solo dígitos, ej: 2235744381)">
        <Input className="rounded-none" value={form.contact_whatsapp} onChange={(e) => set("contact_whatsapp", e.target.value)} placeholder="2235744381" />
        {form.contact_whatsapp && (
          <p className="text-xs text-muted-foreground mt-1">
            Link: <a href={`https://wa.me/${form.contact_whatsapp}`} target="_blank" rel="noreferrer" className="underline hover:text-primary">wa.me/{form.contact_whatsapp}</a>
          </p>
        )}
      </Field>
      <Field label="Email">
        <Input className="rounded-none" type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="kyrbirt@gmail.com" />
      </Field>
      <Field label="Instagram (solo @usuario, sin URL)">
        <Input className="rounded-none" value={form.contact_instagram} onChange={(e) => set("contact_instagram", e.target.value)} placeholder="kyrbirt" />
      </Field>
      <Field label="Dirección / Zona">
        <Input className="rounded-none" value={form.contact_address} onChange={(e) => set("contact_address", e.target.value)} placeholder="Mar del Plata, Buenos Aires" />
      </Field>
      <Field label="Horarios de atención">
        <Input className="rounded-none" value={form.contact_hours} onChange={(e) => set("contact_hours", e.target.value)} placeholder="Lunes a Viernes 10:00 - 18:00" />
      </Field>
      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

// ─── Tab: Guía de Talles ─────────────────────────────────────────────────────
type SizeRow = { size: string; chest: string; length: string };

function SizeGuideTab({ settings, onSaved }: { settings: Settings; onSaved: () => void }) {
  const [rows, setRows] = useState<SizeRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  useEffect(() => {
    try {
      const parsed = JSON.parse(settings.size_guide || "[]");
      setRows(Array.isArray(parsed) && parsed.length > 0 ? parsed : [
        { size: "S", chest: "50", length: "70" },
        { size: "M", chest: "52", length: "72" },
        { size: "L", chest: "54", length: "74" },
        { size: "XL", chest: "56", length: "76" },
      ]);
    } catch { setRows([]); }
  }, [settings]);

  const updateRow = (i: number, key: keyof SizeRow, val: string) => {
    setRows(rows.map((r, j) => j === i ? { ...r, [key]: val } : r));
  };
  const addRow = () => setRows([...rows, { size: "", chest: "", length: "" }]);
  const removeRow = (i: number) => setRows(rows.filter((_, j) => j !== i));

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify({ key: "size_guide", value: JSON.stringify(rows) }),
      });
      onSaved();
      showToast("Guía de talles guardada ✓");
    } catch { showToast("Error al guardar"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-xl">
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-card border border-border px-4 py-3 text-sm tracking-wider shadow-lg">{toast}</div>}

      <p className="text-sm text-muted-foreground mb-6 tracking-wide">
        Esta tabla aparece en el popover "Guía de Talles" del modal de producto.
      </p>

      <div className="border border-border mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <Ruler size={14} className="text-muted-foreground" />
          <p className="text-xs font-bold tracking-widest uppercase">Vista previa</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="py-2 px-5 text-left text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Talle</th>
              <th className="py-2 px-5 text-center text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Sisa</th>
              <th className="py-2 px-5 text-center text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Largo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                <td className="py-2.5 px-5"><span className="font-display tracking-wider text-base">{row.size || "—"}</span></td>
                <td className="py-2.5 px-5 text-center font-mono text-sm text-muted-foreground">{row.chest ? `${row.chest} cm` : "—"}</td>
                <td className="py-2.5 px-5 text-center font-mono text-sm text-muted-foreground">{row.length ? `${row.length} cm` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="py-8 text-center text-muted-foreground text-sm tracking-widest">Sin filas.</div>}
      </div>

      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-1">
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Talle</span>
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Sisa (cm)</span>
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground">Largo (cm)</span>
          <span />
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <Input className="rounded-none h-9" value={row.size} onChange={(e) => updateRow(i, "size", e.target.value)} placeholder="S" />
            <Input className="rounded-none h-9" value={row.chest} onChange={(e) => updateRow(i, "chest", e.target.value)} placeholder="50" />
            <Input className="rounded-none h-9" value={row.length} onChange={(e) => updateRow(i, "length", e.target.value)} placeholder="70" />
            <button onClick={() => removeRow(i)} className="p-2 text-destructive/60 hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        ))}
        <button onClick={addRow} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary flex items-center gap-1 mt-2">
          <Plus size={12} /> Agregar fila
        </button>
      </div>

      <SaveBtn loading={saving} onClick={save} />
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "orders", label: "ÓRDENES", icon: <ShoppingBag size={14} /> },
  { id: "products", label: "PRODUCTOS", icon: <Package size={14} /> },
  { id: "drop", label: "DROP/TIMER", icon: <Clock size={14} /> },
  { id: "fam", label: "FAM", icon: <AlignLeft size={14} /> },
  { id: "contacto", label: "CONTACTO", icon: <Phone size={14} /> },
  { id: "talles", label: "GUÍA TALLES", icon: <Ruler size={14} /> },
  { id: "maintenance", label: "MANTENIMIENTO", icon: <Wrench size={14} /> },
  { id: "footer", label: "PIE DE PÁGINA", icon: <AlignLeft size={14} /> },
];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [settings, setSettings] = useState<Settings>({});

  const fetchSettings = async () => {
    try {
      const res = await adminFetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        _sessionPassword = password;
        setAuthed(true);
        setErrorMsg(null);
        fetchSettings();
      } else if (res.status === 401) {
        setErrorMsg("Contraseña incorrecta");
      } else if (res.status === 503) {
        setErrorMsg("Error del servidor: ADMIN_PASSWORD no configurado en las variables de entorno");
      } else if (res.status === 404) {
        setErrorMsg("Error: el servidor no está desplegado correctamente (ruta no encontrada)");
      } else {
        setErrorMsg(`Error del servidor (${res.status}) — revisá los logs de Vercel`);
      }
    } catch {
      setErrorMsg("No se pudo conectar con el servidor — verificá que el backend esté desplegado");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start py-20 px-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs tracking-widest uppercase mb-4" data-testid="link-admin-back">
              <ArrowLeft size={12} /> Volver al sitio
            </Link>
            <h1 className="font-display text-4xl tracking-widest mb-1">ADMIN</h1>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">Panel de administración — KYRBIRT</p>
          </div>
          {authed && (
            <button
              onClick={() => { setAuthed(false); setPassword(""); setSettings({}); }}
              className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted transition-colors text-sm tracking-wider"
              data-testid="button-logout"
            >
              <LogOut size={14} /> SALIR
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!authed ? (
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-sm mx-auto">
              <div className="border border-border p-8 bg-card">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-14 h-14 border border-border flex items-center justify-center">
                    <Lock size={24} />
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Contraseña</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`rounded-none border-border ${errorMsg ? "border-destructive" : ""}`}
                      placeholder="••••••••"
                      data-testid="input-admin-password"
                    />
                    {errorMsg && <p className="text-destructive text-xs mt-2 tracking-wider">{errorMsg}</p>}
                  </div>
                  <Button type="submit" className="w-full rounded-none font-display tracking-widest" data-testid="button-admin-login">
                    INGRESAR
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Tabs */}
              <div className="flex flex-wrap gap-1 mb-8 border-b border-border pb-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    data-testid={`tab-admin-${tab.id}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "products" && <ProductsTab />}
                {activeTab === "drop" && <DropTab settings={settings} onSaved={fetchSettings} />}
                {activeTab === "fam" && <FamTab settings={settings} onSaved={fetchSettings} />}
                {activeTab === "contacto" && <ContactoTab settings={settings} onSaved={fetchSettings} />}
                {activeTab === "talles" && <SizeGuideTab settings={settings} onSaved={fetchSettings} />}
                {activeTab === "maintenance" && <MaintenanceTab />}
                {activeTab === "footer" && <FooterTab settings={settings} onSaved={fetchSettings} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
