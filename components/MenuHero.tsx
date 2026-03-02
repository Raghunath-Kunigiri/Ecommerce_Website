"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MenuHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface-1)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,106,61,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(212,165,116,0.18),transparent_55%)]" />
      </div>

      <div className="relative grid gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10 lg:py-16">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[color:var(--muted)]"
          >
            BALAJI SNACKS
            <span className="text-[color:var(--brand)]">•</span>
            MENU
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance font-semibold tracking-tight text-[clamp(40px,6vw,64px)] leading-[1.05]"
          >
            Our Menu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-prose text-sm leading-7 text-[color:var(--muted)] sm:text-base"
          >
            Authentic Traditional Snacks and Sweets
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild className="rounded-full">
              <Link href="/products" className="gap-2">
                Shop products <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/#about">About Balaji</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)]"
        >
          <Image
            src="/Items_Images/Sunnundalu.png"
            alt="Balaji Snacks"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.20),transparent_60%)]" />
        </motion.div>
      </div>
    </section>
  );
}

