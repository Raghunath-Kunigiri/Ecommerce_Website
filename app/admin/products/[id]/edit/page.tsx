import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminRequiresDb } from "@/components/admin/admin-requires-db";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin • Edit product" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  if (!process.env.DATABASE_URL) {
    return (
      <AdminShell title="Edit product" description="Update product details.">
        <AdminRequiresDb />
      </AdminShell>
    );
  }

  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) return notFound();

  return (
    <AdminShell title="Edit product" description="Update product details.">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8">
        <ProductForm
          mode="edit"
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            currency: product.currency,
            images: product.images,
            tags: product.tags,
            categoryId: product.categoryId,
            isActive: product.isActive,
          }}
        />
      </div>
    </AdminShell>
  );
}

