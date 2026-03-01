import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
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

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  return (
    <AdminShell title="Orders" description="View and update order status.">
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
              No orders yet. Complete a Stripe test payment to create an order.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}

