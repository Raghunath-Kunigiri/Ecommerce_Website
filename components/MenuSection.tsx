"use client";

import { motion } from "framer-motion";

import type { MenuCategory } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";

export function MenuSection({ section }: { section: MenuCategory }) {
  return (
    <section className="scroll-mt-28">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {section.category}
          </motion.h2>
          {section.subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-prose text-sm text-[color:var(--muted)] sm:text-base"
            >
              {section.subtitle}
            </motion.p>
          ) : null}
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-full origin-left bg-[color:var(--border)] sm:ml-6 sm:w-[240px]"
        />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {section.items.map((it, idx) => (
          <MenuItemCard key={it.id} item={it} index={idx} />
        ))}
      </motion.div>
    </section>
  );
}

