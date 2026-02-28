import Link from "next/link";

import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  const session =
    session_id && process.env.STRIPE_SECRET_KEY
      ? await getStripe().checkout.sessions.retrieve(session_id)
      : null;

  const amount = session?.amount_total ?? null;
  const currency = session?.currency?.toUpperCase() ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <ClearCartOnMount />
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Order successful</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)] sm:text-base">
          Thank you! Your payment has been confirmed.
        </p>
        {amount && currency ? (
          <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--muted)]">Paid</span>
              <span className="font-semibold">
                {(amount / 100).toFixed(2)} {currency}
              </span>
            </div>
            {session?.id ? (
              <div className="mt-1 text-xs text-[color:var(--muted)]">
                Session: {session.id}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

