import type { Category, Product } from "@/lib/types";

import menu from "@/data/products.json";

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
    images: Array.isArray(p.images) ? p.images : [],
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

