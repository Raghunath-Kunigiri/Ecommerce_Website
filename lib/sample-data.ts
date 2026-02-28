import type { Category, Product } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat_sweets", name: "Mithai", slug: "sweets" },
  { id: "cat_snacks", name: "Snacks", slug: "snacks" },
  { id: "cat_namkeen", name: "Namkeen", slug: "namkeen" },
  { id: "cat_bakery", name: "Bakery", slug: "bakery" },
  { id: "cat_chocolates", name: "Chocolate & Fusion", slug: "chocolates" },
  { id: "cat_beverages", name: "Chai & Coffee", slug: "beverages" },
];

const local = (name: string) => `/products/${name}.svg`;

const img = {
  kaju1: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Homemade_Kaju_Katli.jpg",
  kaju2:
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Kaju_katli_dessert_-_top_view.jpg",
  mysore1: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mysore_pak.jpg",
  murukku1: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Murukku.jpg",
  khakhra1: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Khakhra.JPG",
  mixture1:
    "https://upload.wikimedia.org/wikipedia/commons/e/e6/Spicy_and_namkeen_garlic_mixture_snack_with_peanuts%2C_photographed_in_West_Bengal%2C_India%2C_August_13%2C_2024.jpg",
  gulab1:
    "https://upload.wikimedia.org/wikipedia/commons/0/06/Gulab_Jamun_%28Indian_Doughnuts%29.JPG",
  rasgulla1: "https://upload.wikimedia.org/wikipedia/commons/3/39/Rasgulla.jpg",
  plum1: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Plum_cake_with_apple_icing.jpg",
  choco1:
    "https://upload.wikimedia.org/wikipedia/commons/4/48/Aesthetic_Chocolate_burfi.jpg",
  chai1: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Masala_chai.jpg",
} as const;

export const products: Product[] = [
  {
    id: "prod_kaju_katli",
    name: "Kaju Katli (Premium)",
    slug: "kaju-katli-royale",
    description:
      "Classic kaju katli with rich cashew flavour and a delicate silver varak finish.",
    price: 59900,
    category: "sweets",
    images: [img.kaju1, img.kaju2],
    isFeatured: true,
    tags: ["Best Seller", "Gift Box"],
  },
  {
    id: "prod_mysore_pak",
    name: "Mysore Pak (Ghee)",
    slug: "mysore-pak-ghee",
    description:
      "Classic ghee-rich Mysore Pak with a caramelized aroma and soft crumb.",
    price: 34900,
    category: "sweets",
    images: [img.mysore1, img.mysore1],
    isFeatured: true,
    tags: ["Classic"],
  },
  {
    id: "prod_mixture",
    name: "South Indian Mixture",
    slug: "south-indian-mixture",
    description:
      "Crispy sev, peanuts, and spices—balanced heat with a satisfying crunch.",
    price: 19900,
    category: "namkeen",
    images: [img.mixture1, img.mixture1],
    isFeatured: true,
    tags: ["Spicy", "Crunchy"],
  },
  {
    id: "prod_murukku",
    name: "Butter Murukku",
    slug: "butter-murukku",
    description:
      "Light, buttery spirals made for tea-time—crisp without being heavy.",
    price: 17900,
    category: "snacks",
    images: [img.murukku1, img.murukku1],
    tags: ["Tea Time"],
  },
  {
    id: "prod_khakhra",
    name: "Masala Khakhra",
    slug: "masala-khakhra",
    description:
      "Roasted, flaky khakhra with warm spices—perfect for light snacking.",
    price: 14900,
    category: "snacks",
    images: [img.khakhra1, img.khakhra1],
    tags: ["Roasted"],
  },
  {
    id: "prod_gulab_jamun",
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    description:
      "Soft khoya dumplings soaked in saffron sugar syrup—served best slightly warm.",
    price: 29900,
    category: "sweets",
    images: [img.gulab1, img.gulab1],
    isFeatured: true,
    tags: ["Festive"],
  },
  {
    id: "prod_rasgulla",
    name: "Rasgulla (Spongy)",
    slug: "rasgulla-spongy",
    description:
      "Light, spongy chenna balls in syrup—fresh, juicy, and delicate.",
    price: 27900,
    category: "sweets",
    images: [img.rasgulla1, img.rasgulla1],
    tags: ["Bengali"],
  },
  {
    id: "prod_plum_cake",
    name: "Signature Plum Cake",
    slug: "signature-plum-cake",
    description:
      "Bakery-style fruit & nut plum cake—moist crumb with rich buttery notes.",
    price: 44900,
    category: "bakery",
    images: [img.plum1, img.plum1],
    isFeatured: true,
    tags: ["Premium"],
  },
  {
    id: "prod_chocolate_bark",
    name: "Chocolate Barfi (Fusion)",
    slug: "pistachio-chocolate-bark",
    description:
      "A modern twist—barfi texture with cocoa richness and nutty crunch.",
    price: 39900,
    category: "chocolates",
    images: [img.choco1, img.choco1],
    tags: ["Fusion"],
  },
  {
    id: "prod_masala_chai",
    name: "Masala Chai (Kadak)",
    slug: "masala-chai-blend",
    description:
      "Kadak chai blend with elaichi, ginger, and cloves—comfort in every sip.",
    price: 19900,
    category: "beverages",
    images: [img.chai1, img.chai1],
    tags: ["Aromatic"],
  },
];

export function formatMoney(cents: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

