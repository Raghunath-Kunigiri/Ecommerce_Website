"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { Category, Product } from "@/lib/types";
import { CategoryFilter } from "@/components/products/category-filter";
import { ProductCard } from "@/components/products/product-card";

export function FeaturedProducts({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [category, setCategory] = useState<string>("all");

  const featured = useMemo(() => {
    const picked = products.filter((p) => p.isFeatured);
    const base =
      picked.length >= 6
        ? picked
        : [...picked, ...products.filter((p) => !p.isFeatured)].slice(0, 6);
    if (category === "all") return base;
    return base.filter((p) => p.category === category);
  }, [category, products]);

  return (
    <section id="featured" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Featured picks
          </motion.h2>
          <p className="max-w-prose text-sm text-[color:var(--muted)] sm:text-base">
            Our best sellers, crafted in limited batches and packed for gifting.
          </p>
        </div>
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      </div>

      <div className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} showPrice={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

