"use client";

import { SessionProvider } from "next-auth/react";
import { CartPopupProvider } from "@/components/cart/cart-popup-context";
import { ToastProvider } from "@/components/ui/toast-context";
import { CartPopup } from "@/components/cart/cart-popup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartPopupProvider>
          {children}
          <CartPopup />
        </CartPopupProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

