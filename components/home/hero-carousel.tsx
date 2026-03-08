"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroCarousel() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[color:var(--bg)]">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/Items_Images/Intro_Gulabjamun_Video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Keep the video clean — no dark mask. Use a subtle glass card for readability. */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="w-full md:max-w-2xl [text-shadow:0_10px_30px_rgba(0,0,0,0.55)]">
          <div className="text-xs font-semibold tracking-[0.25em] text-[color:var(--brand)] drop-shadow">
            BALAJI SNACKS
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            “Where every bite feels like home.”
          </h1>
          <p className="mt-4 text-pretty text-sm leading-7 text-white/85 sm:text-base">
            Authentic traditional sweets and crunchy snacks — freshly prepared and
            packed for every celebration.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="rounded-2xl">
              <Link href="/products" className="gap-2">
                Shop now <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/menu">View menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

