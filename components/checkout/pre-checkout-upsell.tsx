"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";

import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";
import { FREE_DELIVERY_THRESHOLD_CENTS } from "@/lib/guest-order";
import { Button } from "@/components/ui/button";
import { UpsellProductStrip } from "@/components/checkout/upsell-product-strip";

type Placement = "cart" | "checkout";

type Props = {
  /** Cart page vs checkout — copy and prompts differ slightly */
  placement?: Placement;
};

/** AI + product suggestions from what’s already in the cart (not duplicates). */
export function PreCheckoutUpsell({ placement = "checkout" }: Props) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());

  const [aiText, setAiText] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const cartSummary = useMemo(
    () => items.map((i) => `${i.name} × ${i.quantity}`).join(", "),
    [items],
  );

  const cartPayload = useMemo(
    () => items.map((i) => ({ name: i.name, quantity: i.quantity })),
    [items],
  );

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProducts = fetch("/api/store-products")
      .then((r) => r.json())
      .then((d: { products?: Product[] }) => {
        if (!cancelled && Array.isArray(d.products)) setProducts(d.products);
      })
      .catch(() => {});

    const upsellQuestion =
      placement === "cart"
        ? `The customer is on the cart page. Their basket: ${cartSummary}.
Suggest 3–4 products that are SIMILAR in style or go especially well with what they already picked (same category where it fits, or classic pairings like snacks with sweets, podi with breakfast).
Do NOT suggest anything already in their basket. Name each product with ₹ price and one short reason tied to their choices.`
        : `The customer is on checkout. Their basket: ${cartSummary}.
Suggest 3–4 products to ADD that complement or match the taste of what they already chose — not duplicates.
Give one short line per product with ₹ price. Mention why it fits their current cart.`;

    const loadAi = fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentProduct: cartSummary || "cart",
        cartItems: cartPayload,
        subtotalCents: subtotal,
        question: upsellQuestion,
      }),
    })
      .then((r) => r.json())
      .then((d: { recommendation?: string; error?: string }) => {
        if (cancelled) return;
        const text =
          typeof d.recommendation === "string" && d.recommendation.trim()
            ? d.recommendation
            : d.error ?? null;
        setAiText(text);
      })
      .catch(() => {
        if (!cancelled) setAiText(null);
      });

    Promise.all([loadProducts, loadAi]).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [items, cartSummary, cartPayload, subtotal, placement]);

  /** Prefer products in the same category (or overlapping tags) as cart lines — “similar” picks */
  const picks = useMemo(() => {
    if (products.length === 0 || items.length === 0) return [];
    const byId = new Map(products.map((p) => [p.id, p]));
    const inCart = new Set(items.map((i) => i.productId));

    const cartTags = new Set<string>();
    const categoryWeight = new Map<string, number>();
    for (const i of items) {
      const p = byId.get(i.productId);
      if (!p) continue;
      categoryWeight.set(
        p.category,
        (categoryWeight.get(p.category) ?? 0) + i.quantity,
      );
      for (const t of p.tags ?? []) cartTags.add(t.toLowerCase());
    }

    const candidates = products.filter((p) => !inCart.has(p.id));
    const scored = candidates.map((p) => {
      let score = 0;
      const w = categoryWeight.get(p.category) ?? 0;
      if (w > 0) score += 80 + w * 5;
      if (p.isFeatured) score += 12;
      for (const t of p.tags ?? []) {
        if (cartTags.has(t.toLowerCase())) score += 6;
      }
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((s) => s.p);
  }, [products, items]);

  if (items.length === 0) return null;

  const gapToFree =
    subtotal < FREE_DELIVERY_THRESHOLD_CENTS
      ? (FREE_DELIVERY_THRESHOLD_CENTS - subtotal) / 100
      : 0;

  const headingId =
    placement === "cart" ? "cart-upsell-heading" : "checkout-upsell-heading";

  return (
    <section
      className={
        "rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-[color:var(--surface-1)] p-5"
      }
      aria-labelledby={headingId}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id={headingId}
            className="text-base font-semibold tracking-tight text-amber-950"
          >
            {placement === "cart"
              ? "Similar picks for your cart"
              : "Add more before you check out"}
          </h2>
          <p className="mt-1 text-sm text-amber-900/80">
            {placement === "cart"
              ? "Based on what you added — snacks, sweets, and podis that pair well."
              : "Popular pairings — save a trip and stock up on snacks, sweets, or podis."}
            {gapToFree > 0 ? (
              <span className="mt-1 block font-medium text-amber-950">
                You’re ₹{gapToFree.toFixed(0)} away from free delivery on orders ₹
                {(FREE_DELIVERY_THRESHOLD_CENTS / 100).toFixed(0)}+.
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-[color:var(--muted)]">Loading ideas…</p>
      ) : aiText ? (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 text-sm leading-relaxed text-[color:var(--fg)] whitespace-pre-wrap">
          {aiText}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          Suggestions unavailable right now — browse the shop for more items.
        </p>
      )}

      {picks.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 text-sm font-semibold text-[color:var(--fg)]">
            Similar & complementary — not in your cart yet
          </div>
          <p className="mb-2 text-xs text-[color:var(--muted)]">
            Auto-advances — drag, swipe, or scroll; it pauses briefly when you move it.
          </p>
          <UpsellProductStrip picks={picks} />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/products">
            <ShoppingBag className="mr-2 size-4" aria-hidden />
            Browse all products
          </Link>
        </Button>
      </div>
    </section>
  );
}
