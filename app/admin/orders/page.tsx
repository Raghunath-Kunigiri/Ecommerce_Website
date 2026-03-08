import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { GuestOrderStatusSelect } from "@/components/admin/guest-order-status-select";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/sample-data";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Admin • Orders" };

const statusMap: Record<string, { label: string; variant: "default" | "brand" | "outline" }> = {
  PENDING: { label: "Pending", variant: "outline" },
  PAID: { label: "Paid", variant: "brand" },
  PROCESSING: { label: "Processing", variant: "default" },
  FULFILLED: { label: "Fulfilled", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "outline" },
  REFUNDED: { label: "Refunded", variant: "outline" },
};

const guestStatusMap: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default async function AdminOrdersPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <AdminShell title="Orders" description="View and update order status.">
        <AdminRequiresDb />
        <div className="mt-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
          <div className="text-sm text-[color:var(--muted)]">
            Orders are available after connecting a database (Postgres) and completing Stripe test
            payments.
          </div>
        </div>
      </AdminShell>
    );
  }

  const [orders, guestOrders] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 50,
    }),
    prisma.guestOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <AdminShell title="Orders" description="View and update order status.">
      {/* Stripe orders */}
      <div className="mb-2 text-sm font-semibold text-[color:var(--muted)]">Stripe orders</div>
      <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
        <div className="grid grid-cols-[1.2fr_.7fr_.9fr_.7fr] gap-3 border-b border-[color:var(--border)] px-5 py-3 text-xs font-semibold text-[color:var(--muted)]">
          <div>Order</div>
          <div>Status</div>
          <div>Total</div>
          <div className="text-right">Update</div>
        </div>
        <div className="divide-y divide-[color:var(--border)]">
          {orders.map((o) => {
            const s = statusMap[o.status] ?? { label: o.status, variant: "outline" as const };
            return (
              <div
                key={o.id}
                className="grid grid-cols-[1.2fr_.7fr_.9fr_.7fr] items-center gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{o.id}</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    {new Date(o.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </div>
                <div className="text-sm font-semibold">
                  {formatMoney(o.total, o.currency)}
                </div>
                <OrderStatusSelect orderId={o.id} value={o.status} />
              </div>
            );
          })}
          {orders.length === 0 ? (
            <div className="p-10 text-center text-sm text-[color:var(--muted)]">
              No Stripe orders yet.
            </div>
          ) : null}
        </div>
      </div>

      {/* Guest orders (COD) */}
      <div className="mt-10 mb-2 text-sm font-semibold text-[color:var(--muted)]">Guest orders (COD)</div>
      <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
        <div className="grid grid-cols-[1fr_1fr_.8fr_.9fr_.8fr] gap-3 border-b border-[color:var(--border)] px-5 py-3 text-xs font-semibold text-[color:var(--muted)] sm:grid-cols-[.9fr_1fr_.7fr_.8fr_.9fr]">
          <div>Order ID</div>
          <div>Customer / Mobile</div>
          <div>Total</div>
          <div>Status</div>
          <div className="text-right">Update</div>
        </div>
        <div className="divide-y divide-[color:var(--border)]">
          {guestOrders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[1fr_1fr_.8fr_.8fr_.9fr] items-center gap-3 px-5 py-4 sm:grid-cols-[.9fr_1fr_.7fr_.8fr_.9fr]"
            >
              <div className="min-w-0">
                <div className="truncate font-mono text-sm font-semibold text-[color:var(--brand)]">{o.orderId}</div>
                <div className="text-xs text-[color:var(--muted)]">
                  {new Date(o.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{o.customerName}</div>
                <div className="text-xs text-[color:var(--muted)]">{o.phone}</div>
              </div>
              <div className="text-sm font-semibold">{formatMoney(o.total)}</div>
              <div>
                <Badge variant="outline">{guestStatusMap[o.status] ?? o.status}</Badge>
              </div>
              <GuestOrderStatusSelect orderId={o.orderId} value={o.status} />
            </div>
          ))}
          {guestOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-[color:var(--muted)]">
              No guest orders yet. Customers can place COD orders from checkout.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}

