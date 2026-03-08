# Persistent Cart — Usage

The cart uses **Zustand** with **persist** middleware and **localStorage** key `cart-storage`. Items survive tab close, browser restart, refresh, and work across mobile.

## Files

| Path | Purpose |
|------|--------|
| `lib/store/cart.ts` | Main store (persist, actions) |
| `store/cartStore.ts` | Re-export for `/store` structure |
| `hooks/useCart.ts` | Re-exports `useCart` + `useCartPopup` |
| `components/AddToCartButton.tsx` | Add to cart + open drawer + toast |
| `components/CartDrawer.tsx` | Sliding cart panel (right/bottom) |

## Cart store API

```ts
import { useCart } from "@/lib/store/cart";
// or
import { useCart } from "@/store/cartStore";
// or
import { useCart } from "@/hooks/useCart";

const add = useCart((s) => s.add);           // add(product, quantity?)
const addItem = useCart((s) => s.addItem);   // addItem({ id, name, price, image, quantity? })
const removeItem = useCart((s) => s.removeItem);
const increaseQuantity = useCart((s) => s.increaseQuantity);
const decreaseQuantity = useCart((s) => s.decreaseQuantity);
const clearCart = useCart((s) => s.clearCart);
const totalItems = useCart((s) => s.getTotalItems());
const totalPrice = useCart((s) => s.getTotalPrice());
const items = useCart((s) => s.items);
const hasHydrated = useCart((s) => s.hasHydrated);  // true after localStorage restore
```

## Using AddToCartButton on product pages

```tsx
import { AddToCartButton } from "@/components/AddToCartButton";

<AddToCartButton product={product} />
<AddToCartButton product={product} quantity={2} variant="default" size="lg" />
<AddToCartButton product={product}>Buy now</AddToCartButton>
```

## Opening the cart drawer

```tsx
import { useCartPopup } from "@/hooks/useCart";

const { openPopup } = useCartPopup();
// e.g. on navbar cart icon: onClick={openPopup}
```

## Cart item type

```ts
type CartItem = {
  productId: string;
  name: string;
  price: number;  // cents
  image: string;
  quantity: number;
};
```

## Hydration

- The store restores from `localStorage` on load; use `hasHydrated` before showing cart count to avoid hydration mismatch.
- Only `items` are persisted; the key is `cart-storage`.
