import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/sample-data";

export const metadata = { title: "Admin • Products" };

export default async function AdminProductsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <AdminShell
        title="Products"
        description="Create, edit, and manage your product catalog."
      >
        <AdminRequiresDb />
      </AdminShell>
    );
  }

  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <AdminShell
      title="Products"
      description="Create, edit, and manage your product catalog."
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-[color:var(--muted)]">
          {products.length} item{products.length === 1 ? "" : "s"}
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
        <div className="grid grid-cols-[1.4fr_.9fr_.7fr_.7fr_.7fr] gap-3 border-b border-[color:var(--border)] px-5 py-3 text-xs font-semibold text-[color:var(--muted)]">
          <div>Name</div>
          <div>Category</div>
          <div>Price</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-[color:var(--border)]">
          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1.4fr_.9fr_.7fr_.7fr_.7fr] items-center gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="truncate text-xs text-[color:var(--muted)]">
                  /products/{p.slug}
                </div>
              </div>
              <div className="text-sm">{p.category.name}</div>
              <div className="text-sm font-semibold">
                {formatMoney(p.price, p.currency)}
              </div>
              <div className="text-sm">
                {p.isActive ? "Active" : "Hidden"}
              </div>
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="xs">
                  <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                </Button>
                <ProductRowActions productId={p.id} isActive={p.isActive} />
              </div>
            </div>
          ))}
          {products.length === 0 ? (
            <div className="p-10 text-center text-sm text-[color:var(--muted)]">
              No products yet. Add your first product to start the demo.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}

