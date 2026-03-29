"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/lib/store/cart";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { PreCheckoutUpsell } from "@/components/checkout/pre-checkout-upsell";

export function CartView() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8 text-center">
        <div className="text-lg font-semibold">Your cart is empty</div>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Add something sweet to get started.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((i) => (
          <div
            key={i.productId}
            className="flex gap-4 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4"
          >
            <div className="relative size-24 overflow-hidden rounded-2xl border border-[color:var(--border)]">
              {(() => {
                // Cart may contain stale image URLs from previous demo data. Prefer local/Cloudinary.
                const raw = i.image ?? "";
                const src =
                  raw &&
                  (raw.startsWith("/") ||
                    raw.startsWith("https://res.cloudinary.com/") ||
                    raw.startsWith("https://images.unsplash.com/"))
                    ? raw
                    : "/products/placeholder-sweets.svg";
                return (
              <Image
                src={src}
                alt={i.name}
                fill
                sizes="96px"
                className="object-cover"
              />
                );
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{i.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {formatMoney(i.price)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i.productId)}
                  aria-label="Remove item"
                >
                  <Trash2 />
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-1.5">
                  <span className="min-w-[2rem] px-2 text-center text-sm font-semibold tabular-nums">
                    {i.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-lg text-[color:var(--muted)] hover:bg-[color:var(--border)]/50 hover:text-[color:var(--fg)]"
                    onClick={() => setQuantity(i.productId, i.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-lg bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand)]/90"
                    onClick={() => setQuantity(i.productId, i.quantity + 1)}
                    aria-label="Add more"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                  </Button>
                </div>
                <div className="text-sm font-semibold">
                  {formatMoney(i.price * i.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <PreCheckoutUpsell placement="cart" />
      </div>

      <div className="h-fit rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <div className="text-base font-semibold">Order summary</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[color:var(--muted)]">Subtotal</span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-[color:var(--muted)]">Shipping</span>
          <span className="font-semibold">Calculated at checkout</span>
        </div>
        <div className="mt-6">
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-[color:var(--muted)]">
          Payments are secured with Stripe.
        </p>
      </div>
    </div>
  );
}

