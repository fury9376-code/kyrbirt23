export type Colorway = {
  name: string;
  sizes: string[];
  unavailableSizes: string[];
  soldOut: boolean;
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
};

function cw(names: string[], sizes: string[]): Colorway[] {
  return names.map((name) => ({ name, sizes, unavailableSizes: [], soldOut: false }));
}

export const products: Product[] = [
  {
    id: "sosa-sleeveless-tees",
    name: "SOSA SLEEVELESS TEES",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_pnxqmf",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_iv5zvz",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_tetng2"
    ],
    description: "Jersey 24/1 (peinado)",
    colorways: cw(["Blanco", "Azul marino"], ["S", "M", "L"]),
    price: 25000,
    sizes: ["S", "M", "L"],
    category: "Remeras"
  },
  {
    id: "exclusive-tees",
    name: "EXCLU$$IVE TEES",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_d6t6xz",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_on6xzk",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_afxq2e"
    ],
    description: "Algodón peinado 24/1 con estampa en dtf",
    colorways: cw(["Blanco", "Negro"], ["XS", "S", "M", "L", "XL"]),
    price: 30000,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Remeras"
  },
  {
    id: "mafias-tee",
    name: "MAFIAS TEE",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/v1777758540/IMG_8297_mxg7lj.jpg"
    ],
    description: "Spum sublimable 100% poliéster, estampado completo con sublimación con el nombre en la parte delantera en dtf",
    colorways: cw(["Rojo y Amarillo", "Gris y Negro"], ["1", "2"]),
    price: 40000,
    sizes: ["1", "2"],
    category: "Remeras",
    locked: true
  },
  {
    id: "vision-tees",
    name: "VISION TEES",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_oqvktj",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_quootz",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_uqt1ty"
    ],
    description: "Jersey 24/1 (peinado)",
    colorways: cw(["Crudo", "Negro", "Verde seco"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras"
  },
  {
    id: "guap-tees",
    name: "GUAP TEES",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_hxcfn6",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_qgssan",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_jufx3a"
    ],
    description: "Jersey 24/1 (peinado) con estampa en la parte delantera con dtf y en la del revés serigrafía",
    colorways: cw(["Blanco", "Azul marino"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras"
  },
  {
    id: "fake-tree-bears-tee",
    name: "FAKE TREE BEARS TEE",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_pd4u6b",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_qxechp",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_tmgw8l"
    ],
    description: "Algodón peinado 24/1 con estampa en dtf",
    colorways: cw(["Blanco"], ["S", "M", "L"]),
    price: "SOLD OUT",
    sizes: ["S", "M", "L"],
    category: "Remeras"
  },
  {
    id: "exclusive-fake-tree-pants",
    name: "EXCLU$$IVE PANTS & FAKE TREE PANTS",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_nsziq4",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_ahlkwb",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_ugtluu"
    ],
    description: "Exclusive pants: frisa con estampa en la parte delantera de dtf; Fake tree pants: frisa sublimable 100% poliéster, estampado completo en sublimación con el nombre en la parte delantera en dtf",
    colorways: cw(["Negro", "Gris"], ["1", "2"]),
    price: "SOLD OUT",
    sizes: ["1", "2"],
    category: "Pantalones",
    subcategory: "Pantalones"
  },
  {
    id: "big-kyrt-short",
    name: "BIG KYRT SHORT",
    photos: [
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/1_gus1jv",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/2_jykdve",
      "https://res.cloudinary.com/dwcjuvdtn/image/upload/f_auto,q_auto/3_pmbjmg"
    ],
    description: "Algodón rústico, con un bordado al costado",
    colorways: cw(["Gris", "Negro", "Rosa"], ["1", "2"]),
    price: "SOLD OUT",
    sizes: ["1", "2"],
    category: "Pantalones",
    subcategory: "Shorts"
  }
];
