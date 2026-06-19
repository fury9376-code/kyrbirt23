export type Colorway = {
  name: string;
  sizes: string[];
  unavailableSizes: string[];
  soldOut: boolean;
};

export type SizeGuideRow = {
  size: string;
  chest: string;
  length: string;
};

export type Product = {
  id: string;
  name: string;
  photos: string[];
  description: string;
  colorways: Colorway[];
  price: number | 'SOLD OUT';
  sizes: string[];
  category: 'Remeras' | 'Pantalones' | 'Accesorios' | 'Hoodies';
  subcategory?: string;
  locked?: boolean;
  soldOut?: boolean;
  stock?: number | null;
  sizeGuide?: SizeGuideRow[];
};

function cw(names: string[], sizes: string[]): Colorway[] {
  return names.map((name) => ({ name, sizes, unavailableSizes: [], soldOut: false }));
}

const IMG = (id: string) => `https://i.imgur.com/${id}.jpg`;

export const products: Product[] = [
  {
    id: "sosa-sleeveless-tees",
    name: "SOSA SLEEVELESS TEES",
    photos: [IMG("8SaPPIT"), IMG("Ah4LSO6"), IMG("T3NjbKm")],
    description: "Jersey 24/1 (peinado)",
    colorways: cw(["Blanco", "Azul marino"], ["S", "M", "L"]),
    price: 25000,
    sizes: ["S", "M", "L"],
    category: "Remeras",
    sizeGuide: [
      { size: "S", chest: "50", length: "70" },
      { size: "M", chest: "52", length: "72" },
      { size: "L", chest: "54", length: "74" },
    ],
  },
  {
    id: "exclusive-tees",
    name: "EXCLU$$IVE TEES",
    photos: [IMG("0cqHd98"), IMG("AoZBk80"), IMG("1Nypsga")],
    description: "Algodón peinado 24/1 con estampa en dtf",
    colorways: cw(["Blanco", "Negro"], ["XS", "S", "M", "L", "XL"]),
    price: 30000,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Remeras",
    sizeGuide: [
      { size: "XS", chest: "48", length: "68" },
      { size: "S",  chest: "50", length: "70" },
      { size: "M",  chest: "52", length: "72" },
      { size: "L",  chest: "54", length: "74" },
      { size: "XL", chest: "56", length: "76" },
    ],
  },
  {
    id: "mafias-tee",
    name: "MAFIAS TEE",
    photos: [IMG("iJQCuZX"), IMG("aqu08Iz"), IMG("Qb9U1JL")],
    description: "Spum sublimable 100% poliéster, estampado completo con sublimación con el nombre en la parte delantera en dtf",
    colorways: cw(["Rojo y Amarillo", "Gris y Negro"], ["1", "2"]),
    price: 40000,
    sizes: ["1", "2"],
    category: "Remeras",
    locked: true,
    sizeGuide: [
      { size: "1", chest: "46", length: "62" },
      { size: "2", chest: "48", length: "64" },
    ],
  },
  {
    id: "vision-tees",
    name: "VISION TEES",
    photos: [IMG("xLp4A52"), IMG("pKW7fxK"), IMG("nGHlnd6")],
    description: "Jersey 24/1 (peinado)",
    colorways: cw(["Crudo", "Negro", "Verde seco"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras",
    sizeGuide: [
      { size: "S", chest: "50", length: "70" },
      { size: "M", chest: "52", length: "72" },
      { size: "L", chest: "54", length: "74" },
    ],
  },
  {
    id: "guap-tees",
    name: "GUAP TEES",
    photos: [IMG("lY5VQT8"), IMG("2TU1gvR"), IMG("h393XXm")],
    description: "Jersey 24/1 (peinado) con estampa en la parte delantera con dtf y en la del revés serigrafía",
    colorways: cw(["Blanco", "Azul marino"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras",
    sizeGuide: [
      { size: "S", chest: "50", length: "70" },
      { size: "M", chest: "52", length: "72" },
      { size: "L", chest: "54", length: "74" },
    ],
  },
  {
    id: "fake-tree-bears-tee",
    name: "FAKE TREE BEARS TEE",
    photos: [IMG("i2UEHZJ"), IMG("pWoSXao"), IMG("ZdXA4ea")],
    description: "Algodón peinado 24/1 con estampa en dtf",
    colorways: cw(["Blanco"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras",
    sizeGuide: [
      { size: "S", chest: "50", length: "70" },
      { size: "M", chest: "52", length: "72" },
      { size: "L", chest: "54", length: "74" },
    ],
  },
  {
    id: "exclusive-fake-tree-pants",
    name: "EXCLU$$IVE PANTS & FAKE TREE PANTS",
    photos: [IMG("HomMsc9"), IMG("t2sgyjP"), IMG("uwk64BV")],
    description: "Exclusive pants: frisa con estampa en la parte delantera de dtf; Fake tree pants: frisa sublimable 100% poliéster, estampado completo en sublimación con el nombre en la parte delantera en dtf",
    colorways: cw(["Negro", "Gris"], ["1", "2"]),
    price: "SOLD OUT",
    sizes: ["1", "2"],
    category: "Pantalones",
    subcategory: "Pantalones",
    sizeGuide: [
      { size: "1", chest: "36", length: "96" },
      { size: "2", chest: "38", length: "98" },
    ],
  },
  {
    id: "big-kyrt-short",
    name: "BIG KYRT SHORT",
    photos: [IMG("BJRMoL9"), IMG("drSTjGr"), IMG("PfhxRW0")],
    description: "Algodón rústico, con un bordado al costado",
    colorways: cw(["Gris", "Negro", "Rosa"], ["1", "2"]),
    price: "SOLD OUT",
    sizes: ["1", "2"],
    category: "Pantalones",
    subcategory: "Shorts",
    sizeGuide: [
      { size: "1", chest: "34", length: "50" },
      { size: "2", chest: "36", length: "52" },
    ],
  },
];
