"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
};

/**
 * Reusable add-to-cart button. Adds item (or increases quantity if already in cart),
 * and shows a toast. The cart drawer opens only from the cart icon in the header. Includes a small animation on add.
 */
export function AddToCartButton({
  product,
  quantity = 1,
  variant = "secondary",
  size = "default",
  className,
  children,
}: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const { showToast } = useToast();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    add(product, quantity);
    showToast("Added to cart!");
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(t);
  };

  return (
    <motion.div
      animate={animating ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children ?? (
          <>
            <ShoppingBag className="size-4 shrink-0" />
            Add to cart
          </>
        )}
      </Button>
    </motion.div>
  );
}
