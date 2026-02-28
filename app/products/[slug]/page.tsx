import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { products, formatMoney } from "@/lib/sample-data";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchase } from "@/components/products/product-purchase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Button asChild variant="ghost" className="-ml-2">
          <Link href="/products" className="gap-2">
            <ChevronLeft />
            Back to products
          </Link>
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((t) => (
              <Badge key={t} variant="brand">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            {product.description}
          </p>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[color:var(--muted)]">Price</div>
              <div className="text-xl font-semibold">
                {formatMoney(product.price)}
              </div>
            </div>
            <div className="mt-4">
              <ProductPurchase product={product} />
            </div>
            <p className="mt-4 text-xs text-[color:var(--muted)]">
              Ingredients and allergen info can be configured per product in the
              admin dashboard (coming next).
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
              <div className="text-sm font-semibold">Freshness promise</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                Packed with care for maximum freshness.
              </div>
            </div>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-5">
              <div className="text-sm font-semibold">Secure payments</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                Stripe checkout (wiring next).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

