"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const imgs = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const activeSrc = imgs[active] ?? imgs[0] ?? "";
  const activeIsWikimedia = activeSrc.startsWith("https://upload.wikimedia.org/");

  return (
    <div className="space-y-3">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const el = wrapRef.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          setOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
        }}
      >
        <div className="relative aspect-square">
          <motion.div
            key={activeSrc}
            initial={{ opacity: 0.15, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            <motion.div
              animate={{ scale: zoom ? 1.25 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute inset-0"
              style={{
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            >
              <Image
                src={activeSrc}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                priority
                unoptimized={activeIsWikimedia}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex gap-2 overflow-auto pb-1">
        {imgs.slice(0, 6).map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            onClick={() => setActive(idx)}
            className={cn(
              "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-[color:var(--surface-1)]",
              idx === active
                ? "border-[color:var(--brand)]"
                : "border-[color:var(--border)] hover:border-[color:var(--brand)]/50",
            )}
            aria-label={`Select image ${idx + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
              unoptimized={src.startsWith("https://upload.wikimedia.org/")}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-[color:var(--muted)]">
        Tip: hover the image to zoom.
      </p>
    </div>
  );
}

