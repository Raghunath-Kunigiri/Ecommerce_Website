import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/category-manager";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata = { title: "Admin • Categories" };

export default async function AdminCategoriesPage() {
  if (!process.env.DATABASE_URL) {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);
    const counts = products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    return (
      <AdminShell title="Categories" description="Manage your categories.">
        <AdminRequiresDb />
        <div className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)]">
          <div className="grid grid-cols-[1.3fr_1fr] gap-3 border-b border-[color:var(--border)] px-5 py-3 text-xs font-semibold text-[color:var(--muted)]">
            <div>Category</div>
            <div>Items</div>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {categories.map((c) => (
              <div key={c.id} className="grid grid-cols-[1.3fr_1fr] items-center gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="truncate text-xs text-[color:var(--muted)]">{c.slug}</div>
                </div>
                <div className="text-sm font-semibold">{counts[c.slug] ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      </AdminShell>
    );
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <AdminShell title="Categories" description="Manage your categories.">
      <CategoryManager
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          productsCount: c._count.products,
        }))}
      />
    </AdminShell>
  );
}

