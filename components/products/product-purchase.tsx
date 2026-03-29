"use client";

import { Plus } from "lucide-react";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";

export function ProductPurchase({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const { showToast } = useToast();
  const inCartQty = useCart(
    (s) => s.items.find((i) => i.productId === product.id)?.quantity ?? 0,
  );

  if (inCartQty > 0) {
    return (
      <div className="flex min-h-[48px] touch-manipulation items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-2">
        <span className="min-w-[3rem] px-2 text-center text-base font-semibold tabular-nums text-[color:var(--fg)]">
          {inCartQty} in cart
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl text-[color:var(--muted)] hover:bg-[color:var(--border)]/50 hover:text-[color:var(--fg)]"
          aria-label="Decrease quantity"
          onClick={() => {
            if (inCartQty <= 1) remove(product.id);
            else setQuantity(product.id, inCartQty - 1);
          }}
        >
          −
        </Button>
        <Button
          type="button"
          size="icon"
          className="ml-auto h-11 min-h-[44px] min-w-[44px] shrink-0 rounded-xl bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand)]/90"
          aria-label="Add more"
          onClick={() => {
            add(product, 1);
            showToast("Added to cart!");
          }}
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      className="min-h-[48px] w-full touch-manipulation sm:max-w-xs"
      onClick={() => {
        add(product, 1);
        showToast("Added to cart!");
      }}
    >
      <Plus className="size-4 shrink-0" />
      Add to cart
    </Button>
  );
}

