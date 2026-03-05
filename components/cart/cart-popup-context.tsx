"use client";

import { createContext, useCallback, useContext, useState } from "react";

type CartPopupContextValue = {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
};

const CartPopupContext = createContext<CartPopupContextValue | null>(null);

export function CartPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = useCallback(() => setIsOpen(true), []);
  const closePopup = useCallback(() => setIsOpen(false), []);
  return (
    <CartPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </CartPopupContext.Provider>
  );
}

export function useCartPopup() {
  const ctx = useContext(CartPopupContext);
  if (!ctx) {
    return {
      isOpen: false,
      openPopup: () => {},
      closePopup: () => {},
    };
  }
  return ctx;
}
