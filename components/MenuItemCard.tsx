"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { MenuItem } from "@/data/menu";
import { cn } from "@/lib/utils";

export function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
        }),
      }}
      custom={index}
      className="group relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-[0_22px_60px_-50px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-55px_rgba(0,0,0,0.32)]"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover",
              // If we ever use a non-photo placeholder, keep it centered.
              item.image.endsWith(".svg") && "p-10 object-contain",
            )}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-soft)] via-transparent to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" />
      </div>

      <div className="space-y-1.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold tracking-tight text-[color:var(--fg)]">
              {item.name}
            </div>
            <div className="truncate text-xs text-[color:var(--muted)]">{item.telugu}</div>
          </div>
          {item.price ? (
            <div className="shrink-0 rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-semibold text-[color:var(--fg)]">
              {item.price}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

