import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  const dbEnabled = Boolean(process.env.DATABASE_URL);
  if (!dbEnabled) {
    return (
      <AdminShell
        title="Overview"
        description="Configure Postgres to unlock full admin features."
      >
        <AdminRequiresDb />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Overview" description="Quick snapshot of your store.">
      <OverviewCards />
      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink href="/admin/products" label="Manage products" />
        <QuickLink href="/admin/categories" label="Manage categories" />
        <QuickLink href="/admin/orders" label="View orders" />
      </div>
    </AdminShell>
  );
}

async function OverviewCards() {
  const [productsCount, categoriesCount, ordersCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);

  const cards = [
    { label: "Products", value: productsCount },
    { label: "Categories", value: categoriesCount },
    { label: "Orders", value: ordersCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6"
        >
          <div className="text-sm text-[color:var(--muted)]">{c.label}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="secondary" className="h-auto justify-between rounded-3xl px-6 py-5">
      <Link href={href} className="w-full">
        <span className="text-base font-semibold">{label}</span>
        <span className="ml-3 inline-flex items-center gap-2 text-sm text-[color:var(--muted)]">
          Open <ArrowRight className="size-4" />
        </span>
      </Link>
    </Button>
  );
}

