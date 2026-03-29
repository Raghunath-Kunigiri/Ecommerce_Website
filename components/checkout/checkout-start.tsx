"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  Loader2,
  Banknote,
  ShieldCheck,
  Leaf,
  Award,
} from "lucide-react";

import { useCart } from "@/lib/store/cart";
import { formatMoney } from "@/lib/sample-data";
import { getDeliveryFeeCents, FREE_DELIVERY_THRESHOLD_CENTS } from "@/lib/guest-order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreCheckoutUpsell } from "@/components/checkout/pre-checkout-upsell";

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

export function CheckoutStart() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clearCart = useCart((s) => s.clear);

  const deliveryFeeCents = useMemo(() => getDeliveryFeeCents(subtotal), [subtotal]);
  const totalCents = subtotal + deliveryFeeCents;
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD_CENTS;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  function validate(): boolean {
    const err: Record<string, string> = {};
    if (!customerName.trim()) err.customerName = "Full name is required";
    if (!email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email";
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) err.phone = "Enter a valid 10-digit mobile number";
    else if (!INDIAN_PHONE_REGEX.test(phoneDigits)) err.phone = "Indian mobile number must start with 6–9";
    if (!address.trim() || address.trim().length < 5) err.address = "Delivery address is required (min 5 characters)";
    if (!city.trim()) err.city = "City is required";
    if (!pincode.trim()) err.pincode = "Pincode is required";
    else if (!PINCODE_REGEX.test(pincode.trim())) err.pincode = "Pincode must be 6 digits";
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!validate()) return;

    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/guest-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.replace(/\D/g, "").slice(-10),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          notes: notes.trim() || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Unable to place order. Please try again.");
        return;
      }
      clearCart();
      router.push(`/order-confirmed?id=${encodeURIComponent(data.orderId ?? "")}`);
    } catch {
      setError("Unable to place order. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 md:max-w-none">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            No account needed. Pay when you receive your order.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Total
          </div>
          <div className="text-xl font-extrabold text-[color:var(--brand)]">
            {formatMoney(totalCents)}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="size-5 text-[color:var(--brand)]" />
            <h2 className="text-base font-semibold tracking-tight">
              Delivery details
            </h2>
          </div>
          <div className="space-y-4">
            <label className="block">
              <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                Full Name <span className="text-red-500">*</span>
              </div>
              <Input
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setFieldErrors((p) => ({ ...p, customerName: "" })); }}
                placeholder="Enter your full name"
                className="h-12 rounded-xl"
                aria-invalid={!!fieldErrors.customerName}
              />
              {fieldErrors.customerName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.customerName}</p>
              )}
            </label>
            <label className="block">
              <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                Email <span className="text-red-500">*</span>
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                placeholder="your@email.com"
                className="h-12 rounded-xl"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </label>
            <label className="block">
              <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                Mobile (10-digit) <span className="text-red-500">*</span>
              </div>
              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(v);
                  setFieldErrors((p) => ({ ...p, phone: "" }));
                }}
                placeholder="9876543210"
                className="h-12 rounded-xl"
                aria-invalid={!!fieldErrors.phone}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </label>
            <label className="block">
              <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                Delivery Address <span className="text-red-500">*</span>
              </div>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: "" })); }}
                placeholder="Street, area, landmark"
                rows={2}
                className="flex w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4 text-sm outline-none placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                aria-invalid={!!fieldErrors.address}
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
              )}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                  City <span className="text-red-500">*</span>
                </div>
                <Input
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setFieldErrors((p) => ({ ...p, city: "" })); }}
                  placeholder="City"
                  className="h-12 rounded-xl"
                  aria-invalid={!!fieldErrors.city}
                />
                {fieldErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
                )}
              </label>
              <label className="block">
                <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                  Pincode <span className="text-red-500">*</span>
                </div>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPincode(v);
                    setFieldErrors((p) => ({ ...p, pincode: "" }));
                  }}
                  placeholder="400001"
                  className="h-12 rounded-xl"
                  aria-invalid={!!fieldErrors.pincode}
                />
                {fieldErrors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.pincode}</p>
                )}
              </label>
            </div>
            <label className="block">
              <div className="px-1 pb-1.5 text-sm font-medium text-[color:var(--muted)]">
                Special instructions (optional)
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery time, gate code, etc."
                rows={2}
                className="flex w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4 text-sm outline-none placeholder:text-[color:var(--muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="size-5 text-[color:var(--brand)]" />
            <h2 className="text-base font-semibold tracking-tight">
              Payment
            </h2>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Cash on Delivery (COD)</span>
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Pay when your order is delivered. No online payment required.
            </p>
          </div>
        </section>

        {items.length > 0 ? <PreCheckoutUpsell placement="checkout" /> : null}

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
            <span className="font-semibold">
              {freeDelivery ? (
                <span className="text-emerald-600">FREE</span>
              ) : (
                formatMoney(deliveryFeeCents)
              )}
            </span>
          </div>
          {!freeDelivery && (
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Free delivery on orders above ₹500
            </p>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-[color:var(--border)] pt-3">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-extrabold text-[color:var(--brand)]">
              {formatMoney(totalCents)}
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            <Button
              type="submit"
              size="lg"
              className="h-14 rounded-2xl"
              disabled={pending || items.length === 0}
            >
              {pending ? <Loader2 className="size-5 animate-spin" /> : "Place order (COD)"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cart")}
              className="h-12 rounded-2xl"
            >
              Back to cart
            </Button>
          </div>
        </section>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-4 py-2 opacity-90">
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <ShieldCheck className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">Secure</div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <Leaf className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">Fresh</div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-3 text-center">
          <Award className="size-5 text-[color:var(--brand)]" />
          <div className="text-[10px] font-bold uppercase tracking-wider">Premium</div>
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-[color:var(--muted)]">
        By placing the order you agree to our terms. We’ll send your Order ID and tracking link by email and SMS.
      </p>
    </div>
  );
}
