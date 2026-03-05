"use client";

import { SessionProvider } from "next-auth/react";
import { CartPopupProvider } from "@/components/cart/cart-popup-context";
import { CartPopup } from "@/components/cart/cart-popup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartPopupProvider>
        {children}
        <CartPopup />
      </CartPopupProvider>
    </SessionProvider>
  );
}

