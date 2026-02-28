"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";

import { useCart } from "@/lib/store/cart";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

export function CheckoutStart() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Secure card payments powered by Stripe.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-[color:var(--muted)]">Total</div>
          <div className="text-xl font-semibold">{formatMoney(subtotal)}</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[color:var(--muted)]">Items</span>
          <span className="font-semibold">{items.length}</span>
        </div>
        <div className="mt-2 space-y-1 text-[color:var(--muted)]">
          {items.slice(0, 4).map((i) => (
            <div key={i.productId} className="flex items-center justify-between">
              <span className="truncate pr-4">{i.name}</span>
              <span className="shrink-0">× {i.quantity}</span>
            </div>
          ))}
          {items.length > 4 ? (
            <div className="pt-1 text-xs">…and {items.length - 4} more</div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="sm:flex-1"
          disabled={pending || items.length === 0}
          onClick={async () => {
            setPending(true);
            setError(null);
            try {
              const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  items: items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                  })),
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok || !data?.url) {
                setError("Unable to start checkout. Please try again.");
                return;
              }
              window.location.href = data.url as string;
            } catch {
              setError("Unable to start checkout. Please try again.");
            } finally {
              setPending(false);
            }
          }}
        >
          {pending ? <Loader2 className="animate-spin" /> : <CreditCard />}
          Pay with Stripe
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push("/cart")}
          type="button"
        >
          Back to cart
        </Button>
      </div>
    </div>
  );
}

