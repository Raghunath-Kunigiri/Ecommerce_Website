import type { Category, Product } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat_sweets", name: "Sweets", slug: "sweets" },
  { id: "cat_snacks", name: "Snacks", slug: "snacks" },
  { id: "cat_namkeen", name: "Namkeen", slug: "namkeen" },
  { id: "cat_bakery", name: "Bakery", slug: "bakery" },
  { id: "cat_chocolates", name: "Chocolates", slug: "chocolates" },
  { id: "cat_beverages", name: "Beverages", slug: "beverages" },
];

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const products: Product[] = [
  {
    id: "prod_kaju_katli",
    name: "Kaju Katli Royale",
    slug: "kaju-katli-royale",
    description:
      "Silky cashew fudge finished with edible silver for a melt-in-your-mouth bite.",
    price: 89900,
    category: "sweets",
    images: [
      u("photo-1540189549336-e6e99c3679fe"),
      u("photo-1546069901-ba9599a7e63c"),
    ],
    isFeatured: true,
    tags: ["Best Seller", "Gift Box"],
  },
  {
    id: "prod_mysore_pak",
    name: "Mysore Pak (Ghee)",
    slug: "mysore-pak-ghee",
    description:
      "Classic ghee-rich Mysore Pak with a caramelized aroma and soft crumb.",
    price: 49900,
    category: "sweets",
    images: [u("photo-1499636136210-6f4ee915583e"), u("photo-1509440159598-9a8b2d1d5b44")],
    isFeatured: true,
    tags: ["Classic"],
  },
  {
    id: "prod_mixture",
    name: "South Indian Mixture",
    slug: "south-indian-mixture",
    description:
      "Crispy sev, peanuts, and spices—balanced heat with a satisfying crunch.",
    price: 29900,
    category: "namkeen",
    images: [u("photo-1526318896980-cf78c088247c"), u("photo-1525351484163-7529414344d8")],
    isFeatured: true,
    tags: ["Spicy", "Crunchy"],
  },
  {
    id: "prod_murukku",
    name: "Butter Murukku",
    slug: "butter-murukku",
    description:
      "Light, buttery spirals made for tea-time—crisp without being heavy.",
    price: 24900,
    category: "snacks",
    images: [u("photo-1541592106381-b31e9677c0e5"), u("photo-1546549032-9571cd6b27df")],
    tags: ["Tea Time"],
  },
  {
    id: "prod_khakhra",
    name: "Masala Khakhra",
    slug: "masala-khakhra",
    description:
      "Roasted, flaky khakhra with warm spices—perfect for light snacking.",
    price: 19900,
    category: "snacks",
    images: [u("photo-1499028344343-cd173ffc68a9"), u("photo-1504674900247-0877df9cc836")],
    tags: ["Roasted"],
  },
  {
    id: "prod_plum_cake",
    name: "Signature Plum Cake",
    slug: "signature-plum-cake",
    description:
      "Moist bakery-style cake with dried fruits and a buttery finish.",
    price: 69900,
    category: "bakery",
    images: [u("photo-1542826438-bd32f43d626f"), u("photo-1519869325930-281384150729")],
    isFeatured: true,
    tags: ["Premium"],
  },
  {
    id: "prod_chocolate_bark",
    name: "Pistachio Chocolate Bark",
    slug: "pistachio-chocolate-bark",
    description:
      "Dark chocolate shards with pistachio crunch and a hint of sea salt.",
    price: 54900,
    category: "chocolates",
    images: [u("photo-1549007994-cb92caebd54b"), u("photo-1542291026-7eec264c27ff")],
    tags: ["Dark Chocolate"],
  },
  {
    id: "prod_masala_chai",
    name: "Masala Chai Blend",
    slug: "masala-chai-blend",
    description:
      "Aromatic tea blend with cardamom, ginger, and cloves—comfort in a cup.",
    price: 34900,
    category: "beverages",
    images: [u("photo-1511920170033-f8396924c348"), u("photo-1513558161293-cdaf765ed2fd")],
    tags: ["Aromatic"],
  },
];

export function formatMoney(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

