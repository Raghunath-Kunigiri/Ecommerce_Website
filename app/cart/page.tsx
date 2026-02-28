import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your cart
        </h1>
        <p className="text-sm text-[color:var(--muted)] sm:text-base">
          Review items and proceed to checkout.
        </p>
      </div>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}

