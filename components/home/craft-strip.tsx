"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sweets3D } from "@/components/home/sweets-3d";

export function CraftStrip() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr,1.2fr]">
          <div>
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-medium tracking-[0.28em] text-[#D4A574]"
            >
              HANDCRAFTED DAILY
            </motion.p>
            <motion.h2
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl"
            >
              A little 3D taste of our signature mithai
            </motion.h2>
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-xl text-sm leading-7 text-white/80"
            >
              Subtle motion, premium lighting, and a moody “assembly” vibe—built right into the
              page for a modern, high-end feel.
            </motion.p>
          </div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Sweets3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

