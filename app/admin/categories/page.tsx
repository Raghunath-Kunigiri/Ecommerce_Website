import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata = { title: "Admin • Categories" };

export default async function AdminCategoriesPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <AdminShell title="Categories" description="Manage your categories.">
        <AdminRequiresDb />
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

