"use client";

import { useEffect, useRef } from "react";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";

const AUTO_MS = 3800;
const USER_RESUME_MS = 9000;
const GAP_PX = 16; /* gap-4 */
/** Ignore scroll events just after programmatic scroll (smooth scroll can still fire `scroll`). */
const AUTO_SCROLL_QUIET_MS = 700;

type Props = {
  picks: Product[];
};

/**
 * Horizontally scrollable product strip: auto-advances by one card on an interval,
 * and users can drag / swipe / wheel / scrollbar anytime (auto pauses briefly after manual scroll).
 */
export function UpsellProductStrip({ picks }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoQuietUntilRef = useRef(0);

  useEffect(() => {
    const clearResume = () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };

    const armUserPause = () => {
      userPausedRef.current = true;
      clearResume();
      resumeTimerRef.current = setTimeout(() => {
        userPausedRef.current = false;
        resumeTimerRef.current = null;
      }, USER_RESUME_MS);
    };

    const markAutoScroll = () => {
      autoQuietUntilRef.current = Date.now() + AUTO_SCROLL_QUIET_MS;
    };

    const runAutoScroll = () => {
      const el = scrollerRef.current;
      if (!el || picks.length === 0 || userPausedRef.current) return;

      const slide = el.querySelector<HTMLElement>("[data-upsell-slide]");
      if (!slide) return;

      const step = slide.offsetWidth + GAP_PX;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const nextLeft = el.scrollLeft + step;
      markAutoScroll();
      if (nextLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const onScroll = () => {
      if (Date.now() < autoQuietUntilRef.current) return;
      armUserPause();
    };

    const el = scrollerRef.current;
    if (!el || picks.length === 0) return;

    const onPointerDown = () => armUserPause();
    const onWheel = () => armUserPause();
    const onTouchStart = () => armUserPause();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") armUserPause();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("keydown", onKeyDown);

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intervalId = reduceMotion
      ? null
      : setInterval(runAutoScroll, AUTO_MS);

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
      clearResume();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("keydown", onKeyDown);
    };
  }, [picks]);

  if (picks.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-100/80 bg-white/40 py-3 [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Suggested products you can add — scroll horizontally or wait for auto slide"
        className="flex cursor-grab gap-4 overflow-x-auto scroll-smooth px-1 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] active:cursor-grabbing [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-300/80 hover:[&::-webkit-scrollbar-thumb]:bg-amber-400/90"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {picks.map((p) => (
          <div
            key={p.id}
            data-upsell-slide
            className="w-[min(17.5rem,82vw)] shrink-0 scroll-snap-start snap-always"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
