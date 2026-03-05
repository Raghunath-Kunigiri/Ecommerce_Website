"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useCartPopup } from "@/components/cart/cart-popup-context";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/products/quantity-selector";

export function ProductPurchase({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openPopup = useCartPopup().openPopup;
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <QuantitySelector value={qty} onChange={setQty} />
      <Button
        size="lg"
        className="sm:flex-1"
        onClick={() => {
          add(product, qty);
          openPopup();
        }}
      >
        <ShoppingBag />
        Add to cart
      </Button>
    </div>
  );
}

