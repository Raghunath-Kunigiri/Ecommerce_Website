/**
 * Cart store — re-export from lib for the requested folder structure.
 * Persists to localStorage under key "cart-storage".
 */

export {
  useCart,
  type CartItem,
  type CartItemInput,
} from "@/lib/store/cart";
