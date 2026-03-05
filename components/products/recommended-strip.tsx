"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";

type Props = {
  productSlug: string;
};

type ApiResponse = {
  recommended: Product[];
  error?: string;
};

export function RecommendedStrip({ productSlug }: Props) {
  const [items, setItems] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError(null);

    const load = async () => {
      try {
        const res = await fetch(
          `/api/recommend?productId=${encodeURIComponent(productSlug)}`,
        );
        const data = (await res.json()) as ApiResponse;
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Unable to load suggestions.");
          return;
        }
        if (!cancelled) setItems(data.recommended ?? []);
      } catch {
        if (!cancelled) setError("Unable to load suggestions.");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  if (error || !items || items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="text-lg font-semibold tracking-tight sm:text-xl"
      >
        You may also like
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-5 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4"
      >
        {items.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="min-w-[70%] sm:min-w-0"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

