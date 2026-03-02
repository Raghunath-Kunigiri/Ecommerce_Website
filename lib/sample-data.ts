import type { Category, Product } from "@/lib/types";

import menu from "@/data/products.json";

// Next/Image handles URL encoding internally; keep paths unencoded to avoid double-encoding.
const itemImage = (filename: string) => `/Items_Images/${filename}`;

const imagesBySlug: Record<string, string[]> = {
  // Rotti
  "saddha-rotti": [itemImage("Saddha Rotti.png")],
  "nuvvula-rotti": [itemImage("Nuvvula Rotti.png")],
  // File name uses "Atukula", menu uses "Antukula"
  "antukula-rotti": [itemImage("Atukula Rotti.png")],
  "jonna-rotti": [itemImage("Jonna Rotti.png")],
  "korra-rotti": [itemImage("Korra Rotti.png")],
  "ragi-rotti": [itemImage("Ragi Rotti.jpg")],
  "oodalu-rotti-spicy": [itemImage("Oodalu Rotti (Spicy).png")],
  "oodalu-rotti-plain": [itemImage("Oodalu Rotti (Plain).png")],

  // Hot items
  chekkalu: [itemImage("Chekkalu.png")],
  "uddipappu-chekkalu": [itemImage("Uddipappu Chekkalu.png")],
  "vaamu-chekkalu": [itemImage("Vaamu Chekkalu.png")],
  nippattu: [itemImage("Nippattu.png")],
  "madduru-vada": [itemImage("Madduru Vada.png")],
  "hot-boondi": [itemImage("Hot Boondi.jpg")],
  "sabudana-murukulu": [itemImage("Sabudana Murukulu.png")],
  murukulu: [itemImage("Murukulu.png")],
  janthikalu: [itemImage("Janthikalu.png")],
  mixture: [itemImage("Mixture.png")],
  "borugulu-masala": [itemImage("Borugulu Masala.png")],
  "nimmakaya-borugulu": [itemImage("Nimmakaya Borugulu.png")],
  "diamond-biscuits": [itemImage("Diamond Biscuits.png")],
  atukulu: [itemImage("Atukulu.png")],

  // Sweets
  "khajalu-sugar": [itemImage("Khajalu.png")],
  "rava-laddu-sugar": [itemImage("Rava Laddu (Sugar).png")],
  "rava-laddu-jaggery": [itemImage("Rava Laddu (Jaggery).png")],
  "besan-laddu": [itemImage("Besan Laddu.png")],
  sunnundalu: [itemImage("Sunnundalu.png")],
  "oats-laddu": [itemImage("Oats Laddu.png")],
  "chekkera-kajjikayalu": [itemImage("Chekkera Kajjikayalu.png")],
  "bellam-kajjikayalu": [itemImage("Bellam Kajjikayalu.png")],
  "nuvvula-kajjikayalu": [itemImage("Nuvvula Kajjikayalu.png")],
  "nuvvula-laddu-white": [itemImage("Nuvvula Laddu.png")],
  "nuvvula-laddu-black": [itemImage("Nuvvula Laddu (Jaggery).png")],
  "boondi-laddu-sugar": [itemImage("Boondi Laddu (Sugar).png")],
  "boondi-laddu-jaggery": [itemImage("Boondi Laddu (Jaggery).png")],
  kajjikayalu: [itemImage("Kajjikayalu.png")],
  ariselu: [itemImage("Ariselu.png")],
  "purnam-boorelu": [itemImage("Purnam Boorelu.png")],
  "kobbari-boorelu": [itemImage("Kobbari Boorelu.png")],
  "kova-boorelu": [itemImage("Kova Boorelu.png")],

  // Special items
  "ariselu-special": [itemImage("Ariselu.png")],
  "janthikalu-special": [itemImage("Janthikalu.png")],
  "murukulu-special": [itemImage("Murukulu.png")],
  "mixture-special": [itemImage("Mixture.png")],
  // Use hot boondi image for karam boondi until a dedicated file exists
  "karam-boondi-special": [itemImage("Hot Boondi.jpg")],

  // Festival specials (reuse item photos when available)
  "kajjikayalu-festival": [itemImage("Kajjikayalu.png")],
  "ariselu-festival": [itemImage("Ariselu.png")],
};

export const categories: Category[] = (menu.categories as any[]).map((c) => ({
  id: String(c.id),
  name: String(c.name),
  slug: c.slug,
}));

export const products: Product[] = (menu.products as any[]).map((p) => {
  const rawDesc = String(p.description ?? "");
  const rawNameTe = typeof p.nameTe === "string" ? p.nameTe : undefined;
  const looksTelugu = /[\u0C00-\u0C7F]/.test(rawDesc);

  return {
    id: String(p.id),
    name: String(p.name),
    nameTe: rawNameTe ?? (looksTelugu ? rawDesc : undefined),
    slug: String(p.slug),
    description: looksTelugu ? "" : rawDesc,
    price: Number(p.price ?? 0),
    category: p.category,
    images:
      imagesBySlug[String(p.slug)] ??
      (Array.isArray(p.images) ? p.images : []),
    tags: Array.isArray(p.tags) ? p.tags : [],
    isFeatured:
      Boolean(p.isFeatured) ||
      (Array.isArray(p.tags) && p.tags.includes("Best Seller")) ||
      (Array.isArray(p.tags) && p.tags.includes("Festive")),
  };
});

export function formatMoney(cents: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

