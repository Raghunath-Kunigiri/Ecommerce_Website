"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import type { Category, Product } from "@/lib/types";
import { CategoryFilter } from "@/components/products/category-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  categories: Category[];
  products: Product[];
};

export function ProductsBrowser({ categories, products }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const categoryOk = category === "all" ? true : p.category === category;
      if (!categoryOk) return false;
      if (!q) return true;

      const hay = [
        p.name,
        p.nameTe ?? "",
        p.description,
        p.category,
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [category, products, query]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sweets, snacks, bakery…"
            className="pl-10 pr-12"
            aria-label="Search products"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X />
            </Button>
          ) : null}
        </div>
        <div className="text-sm text-[color:var(--muted)] md:text-right">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        value={category}
        onChange={setCategory}
      />

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-10 text-center">
          <div className="text-lg font-semibold">No products found</div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Try a different search term or clear filters.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button type="button" onClick={() => setQuery("")}>
              Clear search
            </Button>
            <Button type="button" variant="outline" onClick={() => setCategory("all")}>
              Reset category
            </Button>
          </div>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}

