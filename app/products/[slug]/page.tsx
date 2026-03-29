import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

import { formatMoney } from "@/lib/sample-data";
import { getProductBySlug } from "@/lib/catalog";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchase } from "@/components/products/product-purchase";
import { RecommendedStrip } from "@/components/products/recommended-strip";
import AIRecommendChat from "@/components/AIRecommendChat";
import AIRelatedProducts from "@/components/AIRelatedProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBaseUrl, siteName, defaultDescription } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

function absoluteImageUrl(src: string, baseUrl: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return src.startsWith("/") ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const baseUrl = getBaseUrl();
  const title = `${product.name} • ${siteName}`;
  const description =
    product.description.slice(0, 155) + (product.description.length > 155 ? "…" : "");
  const image = product.images?.[0] ? absoluteImageUrl(product.images[0], baseUrl) : undefined;
  return {
    title: product.name,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/products/${product.slug}`,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: `${baseUrl}/products/${product.slug}` },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const baseUrl = getBaseUrl();
  const imageUrl = product.images?.[0]
    ? absoluteImageUrl(product.images[0], baseUrl)
    : baseUrl;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) => absoluteImageUrl(img, baseUrl)) ?? [imageUrl],
    url: `${baseUrl}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price / 100,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex min-h-[44px] flex-wrap items-center gap-1 text-sm text-[color:var(--muted)] touch-manipulation sm:min-h-0">
            <li>
              <Link
                href="/products"
                className="flex items-center gap-1 rounded-lg px-2 py-2 hover:text-[color:var(--fg)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
              >
                <ChevronLeft className="size-4 shrink-0" />
                Products
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <span className="text-[color:var(--muted)]" aria-hidden>/</span>
              <span className="truncate font-medium text-[color:var(--fg)]" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

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
            <p className="mt-2 text-xs font-medium text-[color:var(--brand-strong)]">
              Order by 5 PM for delivery within 1–2 days.
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

          <AIRelatedProducts currentProduct={product.name} />
        </div>
      </div>
      </div>
      <RecommendedStrip productSlug={product.slug} />
      <AIRecommendChat currentProduct={product.name} />
    </div>
  );
}

