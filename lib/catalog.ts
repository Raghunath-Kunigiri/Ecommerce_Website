import type { Category, CategorySlug, Product } from "@/lib/types";
import { categories as sampleCategories, products as sampleProducts } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";

function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getCategories(): Promise<Category[]> {
  if (!isDbEnabled()) return sampleCategories;
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug as CategorySlug }));
}

export async function getProducts(): Promise<Product[]> {
  if (!isDbEnabled()) return sampleProducts;
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category.slug as CategorySlug,
    images: p.images,
    tags: p.tags ?? [],
    isFeatured: (p.tags ?? []).some((t) =>
      ["Best Seller", "Festive", "Gift Box", "Premium"].includes(t),
    ),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbEnabled()) return sampleProducts.find((p) => p.slug === slug) ?? null;
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!row || !row.isActive) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    category: row.category.slug as CategorySlug,
    images: row.images,
    tags: row.tags ?? [],
    isFeatured: (row.tags ?? []).some((t) =>
      ["Best Seller", "Festive", "Gift Box", "Premium"].includes(t),
    ),
  };
}

