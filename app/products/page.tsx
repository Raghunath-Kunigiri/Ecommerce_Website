import { ProductsBrowser } from "@/components/products/products-browser";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Shop sweets & snacks
          </h1>
          <p className="max-w-prose text-sm text-[color:var(--muted)] sm:text-base">
            Browse categories and discover handcrafted favorites.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ProductsBrowser categories={categories} products={products} />
      </div>
    </div>
  );
}

