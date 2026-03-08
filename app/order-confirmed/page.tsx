import { Suspense } from "react";
import { OrderConfirmedView } from "./order-confirmed-view";

export const metadata = {
  title: "Order confirmed",
  description: "Your order has been placed successfully.",
};

export default function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Suspense fallback={<div className="text-center text-[color:var(--muted)]">Loading…</div>}>
        <OrderConfirmedView searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
