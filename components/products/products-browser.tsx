"use client";

import { useMemo, useState } from "react";

import type { Category, Product } from "@/lib/types";
import { CategoryFilter } from "@/components/products/category-filter";
import { ProductGrid } from "@/components/products/product-grid";

type Props = {
  categories: Category[];
  products: Product[];
};

export function ProductsBrowser({ categories, products }: Props) {
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  return (
    <div className="space-y-8">
      <CategoryFilter
        categories={categories}
        value={category}
        onChange={setCategory}
      />
      <ProductGrid products={filtered} />
    </div>
  );
}

