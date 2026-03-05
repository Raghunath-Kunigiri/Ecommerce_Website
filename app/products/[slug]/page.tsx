import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { formatMoney } from "@/lib/sample-data";
import { getProductBySlug } from "@/lib/catalog";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchase } from "@/components/products/product-purchase";
import { RecommendedStrip } from "@/components/products/recommended-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
              Packed fresh with care. If you have allergy questions, contact our
              support before placing the order.
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
                UPI / Cards / Netbanking via Stripe.
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecommendedStrip productSlug={product.slug} />
    </div>
  );
}

