"use client";

import { useEffect, useState } from "react";
import { Search, Truck, MessageCircle, Package, CheckCircle2 } from "lucide-react";
import { formatMoney } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GUEST_ORDER_STATUSES, type GuestOrderStatusValue } from "@/lib/guest-order";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "919876543210";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const STAGE_LABELS: Record<GuestOrderStatusValue, string> = {
  CONFIRMED: "Order confirmed",
  PREPARING: "Preparing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

type OrderData = {
  orderId: string;
  customerName: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  status: GuestOrderStatusValue;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
};

export function TrackOrderView({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const [inputId, setInputId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    searchParams.then((p) => {
      const id = (p.id ?? "").trim().toUpperCase();
      if (id) {
        setInputId(id);
        setOrderId(id);
        setSearched(true);
        setLoading(true);
        setNotFound(false);
        fetch(`/api/orders/${encodeURIComponent(id)}`)
          .then((res) => {
            if (!res.ok) {
              setOrder(null);
              setNotFound(true);
              return;
            }
            return res.json();
          })
          .then((data: OrderData | undefined) => {
            if (data) {
              setOrder(data);
              setNotFound(false);
            } else {
              setNotFound(true);
            }
          })
          .catch(() => {
            setOrder(null);
            setNotFound(true);
          })
          .finally(() => setLoading(false));
      }
    });
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = inputId.trim().toUpperCase();
    if (!id) return;
    setOrderId(id);
    setSearched(true);
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    fetch(`/api/orders/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) {
          setOrder(null);
          setNotFound(true);
          return;
        }
        return res.json();
      })
      .then((data: OrderData | undefined) => {
        if (data) {
          setOrder(data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setOrder(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }

  const statusIndex = order ? GUEST_ORDER_STATUSES.indexOf(order.status) : -1;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Track your order</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Enter your Order ID (e.g. BLJ847293) to see status and delivery details.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={inputId}
          onChange={(e) => setInputId(e.target.value.toUpperCase())}
          placeholder="BLJ847293"
          className="h-12 flex-1 rounded-xl font-mono uppercase"
          maxLength={9}
        />
        <Button type="submit" size="lg" className="h-12 rounded-xl px-6" disabled={loading || !inputId.trim()}>
          {loading ? (
            <span className="animate-pulse">Searching…</span>
          ) : (
            <>
              <Search className="size-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {searched && !loading && notFound && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
          <p className="font-medium">Order not found</p>
          <p className="mt-1 text-sm">Please check the Order ID and try again. Need help? Contact us on WhatsApp.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
          >
            <MessageCircle className="size-5" />
            WhatsApp support
          </a>
        </div>
      )}

      {searched && !loading && order && (
        <>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-lg font-bold text-[color:var(--brand)]">{order.orderId}</span>
              <span className="text-sm text-[color:var(--muted)]">
                Ordered {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{order.customerName}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-[color:var(--muted)]">
              <Truck className="size-4" />
              Estimated delivery:{" "}
              {order.estimatedDeliveryDate
                ? new Date(order.estimatedDeliveryDate + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <h2 className="text-base font-semibold">Status</h2>
            <ul className="mt-4 space-y-0">
              {GUEST_ORDER_STATUSES.map((status, i) => {
                const isDone = i <= statusIndex;
                const isCurrent = i === statusIndex;
                const label = STAGE_LABELS[status];
                return (
                  <li key={status} className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCurrent
                            ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                            : "border-[color:var(--border)] bg-[color:var(--surface-2)]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="size-4" /> : <Package className="size-4" />}
                    </div>
                    <div className="pb-5">
                      <p className={`font-medium ${isDone ? "text-emerald-700" : isCurrent ? "text-[color:var(--brand)]" : "text-[color:var(--muted)]"}`}>
                        {label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <h2 className="text-base font-semibold">Items</h2>
            <ul className="mt-3 space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-[color:var(--border)] pt-3 font-semibold">
              <span>Total</span>
              <span className="text-[color:var(--brand)]">{formatMoney(order.total)}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-[color:var(--muted)]">Questions about your order?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white"
            >
              <MessageCircle className="size-5" />
              WhatsApp support
            </a>
          </div>
        </>
      )}
    </div>
  );
}
