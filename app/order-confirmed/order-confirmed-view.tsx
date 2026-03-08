"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Truck, MessageCircle } from "lucide-react";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { CopyOrderIdButton } from "@/components/order/copy-order-id";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "919876543210";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

type OrderData = {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  estimatedDeliveryDate: string;
};

export function OrderConfirmedView({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchParams.then((p) => {
      const id = (p.id ?? "").trim().toUpperCase();
      setOrderId(id);
      if (!id) {
        setLoading(false);
        setError(true);
        return;
      }
      fetch(`/api/orders/${encodeURIComponent(id)}`)
        .then((res) => {
          if (cancelled) return;
          if (!res.ok) {
            setError(true);
            return;
          }
          return res.json();
        })
        .then((data: OrderData | undefined) => {
          if (cancelled || !data) return;
          setOrder({
            orderId: data.orderId,
            customerName: data.customerName,
            items: data.items ?? [],
            total: data.total,
            estimatedDeliveryDate: data.estimatedDeliveryDate ?? "",
          });
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (loading) {
    return <div className="text-center text-[color:var(--muted)]">Loading…</div>;
  }

  if (!orderId || error || !order) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8 text-center">
        <p className="text-[color:var(--muted)]">Order not found or invalid Order ID.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Order confirmed</h1>
        <p className="mt-1 text-[color:var(--muted)]">
          Thanks, {order.customerName}. We’ve received your order.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-xl bg-[color:var(--surface-2)] px-4 py-2 font-mono text-lg font-bold text-[color:var(--brand)]">
            {order.orderId}
          </span>
          <CopyOrderIdButton orderId={order.orderId} />
        </div>

        <p className="mt-4 text-sm text-[color:var(--muted)]">
          Confirmation and tracking link have been sent to your email and mobile number.
        </p>
      </div>

      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
        <h2 className="text-base font-semibold">Order summary</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-[color:var(--border)] pt-3 font-semibold">
          <span>Total paid</span>
          <span className="text-[color:var(--brand)]">{formatMoney(order.total)}</span>
        </div>
        {order.estimatedDeliveryDate && (
          <p className="mt-2 flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <Truck className="size-4" />
            Estimated delivery:{" "}
            {new Date(order.estimatedDeliveryDate + "T12:00:00").toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="rounded-2xl">
          <Link href={`/track?id=${encodeURIComponent(order.orderId)}`}>
            Track my order
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-5 mr-2" />
            WhatsApp support
          </a>
        </Button>
      </div>
    </div>
  );
}
