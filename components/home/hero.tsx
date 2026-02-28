"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] size-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,81,0.25),transparent_55%)] blur-2xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] size-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.22),transparent_55%)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2"
          >
            <Badge variant="brand" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Fresh Mithai • Namkeen • Handcrafted
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl"
          >
            Mithai & snacks for every festival—and every craving.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="max-w-prose text-pretty text-base leading-7 text-[color:var(--muted)] sm:text-lg"
          >
            Explore fresh Indian sweets, crunchy namkeen, and tea-time snacks—perfect
            for gifting, pooja, and family celebrations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <Link href="/products" className="group">
                Shop collection
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#featured">Explore featured</Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-xs text-[color:var(--muted)] sm:text-sm">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
              <div className="text-sm font-semibold text-[color:var(--fg)]">
                Fresh batches
              </div>
              <div className="pt-1">Made daily</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
              <div className="text-sm font-semibold text-[color:var(--fg)]">
                Premium pack
              </div>
              <div className="pt-1">Gift-ready</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
              <div className="text-sm font-semibold text-[color:var(--fg)]">
                Secure pay
              </div>
              <div className="pt-1">UPI / Cards</div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.25))] p-2 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.35)]">
            <div className="grid gap-2 rounded-[1.25rem] bg-[color:var(--surface-1)] p-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,122,81,0.40),transparent_60%)] p-6">
                  <div className="text-xs font-medium text-[color:var(--muted)]">
                    Gift Boxes
                  </div>
                  <div className="pt-1 text-lg font-semibold tracking-tight">
                    Festive assortments
                  </div>
                </div>
                <div className="rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(255,214,102,0.38),transparent_60%)] p-6">
                  <div className="text-xs font-medium text-[color:var(--muted)]">
                    Tea-Time
                  </div>
                  <div className="pt-1 text-lg font-semibold tracking-tight">
                    Crisps & murukku
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-6">
                <div className="text-xs font-medium text-[color:var(--muted)]">
                  This week’s picks
                </div>
                <div className="pt-2 text-2xl font-semibold tracking-tight">
                  Kaju Katli • Mysore Pak
                </div>
                <div className="pt-2 text-sm text-[color:var(--muted)]">
                  Crafted with premium ghee & nuts. Limited batches.
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -inset-x-8 -bottom-10 -z-10 h-24 bg-[radial-gradient(closest-side,rgba(0,0,0,0.25),transparent)] blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

