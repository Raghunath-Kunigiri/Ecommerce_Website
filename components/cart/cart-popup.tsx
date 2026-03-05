"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, Maximize2, Minimize2, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/store/cart";
import { useCartPopup } from "@/components/cart/cart-popup-context";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CartPopup() {
  const { isOpen, closePopup } = useCartPopup();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const count = useCart((s) => s.count());
  const [enlarged, setEnlarged] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const toggleEnlarge = () => setEnlarged((e) => !e);
  const toggleMinimize = () => setMinimized((m) => !m);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="cart-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-end p-0 md:items-center md:justify-center md:p-4"
          aria-modal="true"
          role="dialog"
          aria-label="Cart"
        >
          <button
          type="button"
          aria-label="Close overlay"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={closePopup}
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            relative z-[101] flex w-full flex-col overflow-hidden rounded-t-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] shadow-2xl
            md:rounded-3xl md:border-2
            ${enlarged ? "md:max-h-[90vh] md:w-[420px]" : "md:max-h-[75vh] md:w-[380px]"}
            ${minimized ? "max-h-[72px]" : "max-h-[85vh]"}
            bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-6
            pb-safe
          `}
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0)",
          }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingBag className="size-5 shrink-0 text-[color:var(--brand)]" />
              <span className="truncate font-semibold text-[color:var(--fg)]">
                Cart {count > 0 ? `(${count} item${count === 1 ? "" : "s"})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label={minimized ? "Expand list" : "Minimize"}
                onClick={toggleMinimize}
              >
                {minimized ? (
                  <Maximize2 className="size-4" />
                ) : (
                  <Minimize2 className="size-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label={enlarged ? "Shrink popup" : "Enlarge popup"}
                onClick={toggleEnlarge}
              >
                {enlarged ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Hide cart"
                onClick={closePopup}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {minimized ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm text-[color:var(--muted)]">
                {count} item{count === 1 ? "" : "s"} · {formatMoney(subtotal)}
              </span>
              <Button asChild size="sm">
                <Link href="/cart" onClick={closePopup}>
                  View cart
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* List */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {items.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-[color:var(--muted)]">
                      Your cart is empty
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={closePopup}
                    >
                      Keep shopping
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-[color:var(--border)] p-2">
                    {items.map((i) => {
                      const raw = i.image ?? "";
                      const src =
                        raw &&
                        (raw.startsWith("/") ||
                          raw.startsWith("https://res.cloudinary.com/") ||
                          raw.startsWith("https://images.unsplash.com/"))
                          ? raw
                          : "/products/placeholder-sweets.svg";
                      return (
                        <li
                          key={i.productId}
                          className="flex gap-3 rounded-2xl p-2 hover:bg-[color:var(--surface-2)]/50"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-[color:var(--border)]">
                            <Image
                              src={src}
                              alt={i.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-[color:var(--fg)]">
                                {i.name}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                aria-label="Remove"
                                onClick={() => remove(i.productId)}
                              >
                                <Trash2 className="size-3.5 text-red-500" />
                              </Button>
                            </div>
                            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                              {formatMoney(i.price)} each
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)]">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Decrease"
                                  onClick={() =>
                                    setQuantity(
                                      i.productId,
                                      Math.max(1, i.quantity - 1),
                                    )
                                  }
                                >
                                  <Minus className="size-3.5" />
                                </Button>
                                <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                                  {i.quantity}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Increase"
                                  onClick={() =>
                                    setQuantity(i.productId, i.quantity + 1)
                                  }
                                >
                                  <Plus className="size-3.5" />
                                </Button>
                              </div>
                              <span className="text-sm font-semibold tabular-nums">
                                {formatMoney(i.price * i.quantity)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {items.length > 0 ? (
                <div className="shrink-0 border-t border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--muted)]">Subtotal</span>
                    <span className="font-semibold tabular-nums">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/cart" onClick={closePopup}>
                      Go to cart
                    </Link>
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
