"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/sample-data";

type Slide = {
  key: string;
  label: string;
  headline: string;
  tagline?: string;
  description?: string;
  pricePaise?: number;
  unit?: string;
  imageSrc: string;
  productHref?: string;
};

const AUTOPLAY_MS = 7000;

export function HeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "sunnundalu",
        label: "SIGNATURE SWEETS",
        headline: "Sunnundalu",
        tagline: "Roasted urad laddu, pure comfort.",
        description: "A Balaji classic—slow roasted, aromatic, and melt‑in‑mouth.",
        pricePaise: 24900,
        unit: "per pack",
        imageSrc: "/Items_Images/Sunnundalu.png",
        productHref: "/products/sunnundalu",
      },
      {
        key: "chekkalu",
        label: "HOT & CRISPY",
        headline: "Chekkalu",
        tagline: "Crisp, spiced, addictive.",
        description: "Perfect tea‑time crunch with that homemade touch.",
        pricePaise: 14900,
        unit: "per pack",
        imageSrc: "/Items_Images/Chekkalu.png",
        productHref: "/products/chekkalu",
      },
      {
        key: "mixture",
        label: "CRUNCHY SPECIAL",
        headline: "Mixture",
        tagline: "Spicy, crunchy, and satisfying.",
        description: "A bold mix for movie nights and chai breaks.",
        pricePaise: 14900,
        unit: "per pack",
        imageSrc: "/Items_Images/Mixture.png",
        productHref: "/products/mixture-special",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const active = slides[index]!;

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[color:var(--bg)]">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 scale-[1.04]">
              <Image
                src={active.imageSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-[var(--hero-image-opacity)]"
                style={{ filter: "var(--hero-image-filter)" }}
              />
            </div>
            <div className="absolute inset-0 opacity-[var(--hero-radial-opacity)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,106,61,1),transparent_55%)]" />
            <div className="absolute inset-0 opacity-[var(--hero-linear-opacity)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.45),rgba(0,0,0,0.72))]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-12rem] size-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,106,61,0.20),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] size-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.14),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative mx-auto h-full max-w-6xl px-4 sm:px-6">
        <div className="relative h-full">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-full w-full opacity-[var(--hero-vignette-opacity)] bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent_45%,rgba(0,0,0,0.55))]" />
          </div>

          <div className="pointer-events-none absolute left-0 right-0 top-0 h-full">
            <div className="pointer-events-none absolute left-0 top-[140px] max-w-[520px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.key}-tl`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto text-left text-white"
                >
                  <div className="text-xs font-medium tracking-[0.25em] text-[color:var(--brand)]/95">
                    {active.label}
                  </div>
                  <h1 className="mt-5 text-balance font-semibold tracking-tight text-white text-[clamp(44px,6.8vw,92px)] leading-[1.05]">
                    {active.headline}
                  </h1>
                  {active.tagline ? (
                    <p className="mt-4 text-balance font-[450] italic text-white/90 text-[clamp(18px,2.6vw,34px)] leading-[1.25]">
                      {active.tagline}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute bottom-[86px] right-0 max-w-[520px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.key}-br`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto flex flex-col items-end text-right text-white"
                >
                  {active.description ? (
                    <p className="max-w-[440px] text-sm leading-7 text-white/90 sm:text-base">
                      {active.description}
                    </p>
                  ) : null}

                  {typeof active.pricePaise === "number" ? (
                    <div className="mt-6 flex items-baseline gap-3">
                      <span className="text-[42px] font-semibold tracking-tight text-[color:var(--brand)]">
                        {formatMoney(active.pricePaise)}
                      </span>
                      {active.unit ? (
                        <span className="text-sm text-white/85">{active.unit}</span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <Button
                      asChild
                      className="rounded-sm border border-white/40 bg-white/10 backdrop-blur hover:bg-white hover:text-black"
                    >
                      <Link href={active.productHref ?? "/products"} className="gap-2">
                        Shop now <ArrowRight />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="rounded-sm border border-white/25 bg-transparent text-white hover:bg-white/10"
                      variant="outline"
                    >
                      <Link href="/products" className="gap-2">
                        View all
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-[60px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-3 w-3 rounded-full bg-white/25 transition",
                  i === index &&
                    "w-8 rounded-full bg-[color:var(--brand)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.18em] text-white/70">
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}

