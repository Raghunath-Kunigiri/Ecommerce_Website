"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/lib/types";

/** Cart item shape: persisted in localStorage for cross-tab and post-refresh restore */
export type CartItem = {
  productId: string;
  name: string;
  price: number; // cents
  image: string;
  quantity: number;
};

/** Input shape for addItem() — id used as productId */
export type CartItemInput = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  add: (product: Product, quantity?: number) => void;
  addItem: (item: CartItemInput) => void;
  remove: (productId: string) => void;
  removeItem: (id: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clear: () => void;
  clearCart: () => void;
  subtotal: () => number;
  count: () => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? "",
                quantity,
              },
            ],
          };
        }),

      addItem: (item) =>
        set((state) => {
          const qty = Math.max(1, Math.floor(item.quantity ?? 1));
          const existing = state.items.find((i) => i.productId === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.id ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: item.id,
                name: item.name,
                price: item.price,
                image: item.image ?? "",
                quantity: qty,
              },
            ],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== id),
        })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.floor(quantity || 1)) }
              : i,
          ),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === id
              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),
      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

