"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bolt,
  CreditCard,
  Leaf,
  Loader2,
  Lock,
  ShieldCheck,
  Truck,
  Award,
} from "lucide-react";

import { useCart } from "@/lib/store/cart";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutStart() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="mx-auto w-full max-w-md space-y-6 md:max-w-none">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Fast, secure payments.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Total
          </div>
          <div className="text-xl font-extrabold text-[color:var(--brand)]">
            {formatMoney(subtotal)}
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bolt className="size-5 text-[color:var(--brand)]" />
          <h2 className="text-base font-semibold tracking-tight">
            Express Checkout
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 justify-center"
            disabled
          >
            Apple Pay
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 justify-center"
            disabled
          >
            Google Pay
          </Button>
        </div>
        <p className="mt-3 text-xs text-[color:var(--muted)]">
          Express options will be enabled at launch.
        </p>
      </section>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Truck className="size-5 text-[color:var(--brand)]" />
          <h2 className="text-base font-semibold tracking-tight">
            Shipping Information
          </h2>
        </div>
        <div className="space-y-4">
          <label className="block">
            <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
              Full Name
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="h-12 rounded-xl"
            />
          </label>
          <label className="block">
            <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
              Delivery Address
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, Apartment, Area"
              rows={2}
              className="flex w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4 text-sm outline-none placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="size-5 text-[color:var(--brand)]" />
          <h2 className="text-base font-semibold tracking-tight">
            Payment Method
          </h2>
        </div>
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-3">
            <div className="text-sm font-semibold text-[color:var(--muted)]">
              Card payment
            </div>
            <Lock className="size-4 text-[color:var(--muted)]" />
          </div>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            You’ll complete payment securely on Stripe.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
        <div className="text-base font-semibold">Order summary</div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[color:var(--muted)]">
            Subtotal ({items.length} items)
          </span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-[color:var(--muted)]">Delivery</span>
          <span className="font-semibold text-emerald-600">FREE</span>
        </div>
        <div className="mt-3 border-t border-[color:var(--border)] pt-3 flex items-center justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-xl font-extrabold text-[color:var(--brand)]">
            {formatMoney(subtotal)}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <Button
            size="lg"
            className="h-14 rounded-2xl"
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
            {pending ? <Loader2 className="animate-spin" /> : <Lock />}
            Pay securely
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/cart")}
            type="button"
            className="h-12 rounded-2xl"
          >
            Back to cart
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-4 py-2 opacity-90">
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <ShieldCheck className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">
            Secure SSL
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <Leaf className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">
            Fresh
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <Award className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">
            Premium
          </div>
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-[color:var(--muted)]">
        By completing this purchase you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}

