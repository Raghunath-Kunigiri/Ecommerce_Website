"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GUEST_ORDER_STATUSES } from "@/lib/guest-order";

const LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function GuestOrderStatusSelect({
  orderId,
  value,
}: {
  orderId: string;
  value: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-9 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-1)] px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
      >
        {GUEST_ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {LABELS[s] ?? s}
          </option>
        ))}
      </select>
      <Button
        size="xs"
        variant="outline"
        disabled={pending || status === value}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            const res = await fetch(`/api/admin/guest-orders/${encodeURIComponent(orderId)}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError((data?.error as string) ?? "Failed");
              setStatus(value);
              return;
            }
            router.refresh();
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "…" : "Save"}
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
