"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
] as const;

export function OrderStatusSelect({
  orderId,
  value,
}: {
  orderId: string;
  value: string;
}) {
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
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
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
            const res = await fetch(`/api/admin/orders/${orderId}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ status }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError(data?.error ?? "Failed");
              setStatus(value);
              return;
            }
          } finally {
            setPending(false);
          }
        }}
      >
        Save
      </Button>
      {error ? <span className="text-xs text-[color:var(--muted)]">{error}</span> : null}
    </div>
  );
}

