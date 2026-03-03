"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/sample-data";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  product: Product;
  showPrice?: boolean;
};

export function ProductCard({ product, showPrice = true }: Props) {
  const add = useCart((s) => s.add);
  const rawSrc = product.images[0] ?? "";
  const src =
    rawSrc && (rawSrc.startsWith("/") || rawSrc.startsWith("http"))
      ? rawSrc
      : product.category === "rotti"
        ? "/products/placeholder-rotti.svg"
        : product.category === "hot-items"
          ? "/products/placeholder-hot-items.svg"
          : product.category === "podulu"
            ? "/products/placeholder-podulu.svg"
            : product.category === "special-items"
              ? "/products/placeholder-special.svg"
              : product.category === "festival-specials"
                ? "/products/placeholder-festival.svg"
                : "/products/placeholder-sweets.svg";
  const isWikimedia = src.startsWith("https://upload.wikimedia.org/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="group relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_30px_80px_-65px_rgba(0,0,0,0.30)]"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              unoptimized={isWikimedia}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-soft)] via-transparent to-transparent opacity-0 transition-opacity md:group-hover:opacity-100" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.tags?.slice(0, 2).map((t) => (
              <Badge key={t} variant="brand" className="backdrop-blur">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="block truncate text-base font-semibold tracking-tight text-[color:var(--fg)] hover:underline"
            >
              {product.name}
            </Link>
            {product.nameTe ? (
              <div className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                {product.nameTe}
              </div>
            ) : null}
            <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">
              {product.description || "Freshly made at Balaji Snacks — Anantapur."}
            </p>
          </div>
          {showPrice ? (
            <div className="shrink-0 text-right">
              <div className="text-sm font-semibold text-[color:var(--fg)]">
                {formatMoney(product.price)}
              </div>
              <div className="text-xs text-[color:var(--muted)]">per pack</div>
            </div>
          ) : null}
        </div>

        <div className="pt-2">
          <Button
            onClick={() => add(product, 1)}
            className="w-full"
            variant="secondary"
          >
            <Plus />
            Add to cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

