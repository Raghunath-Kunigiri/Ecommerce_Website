import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin • New product" };

export default async function NewProductPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <AdminShell title="New product" description="Add a new item to your store.">
        <AdminRequiresDb />
      </AdminShell>
    );
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell title="New product" description="Add a new item to your store.">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
        <ProductForm mode="create" categories={categories} />
      </div>
    </AdminShell>
  );
}

