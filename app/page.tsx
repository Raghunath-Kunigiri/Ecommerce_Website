import type { Metadata } from "next";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import { About } from "@/components/home/about";
import { HomeFaq } from "@/components/home/home-faq";
import { getCategories, getProducts } from "@/lib/catalog";
import { getBaseUrl, siteName, siteTagline, defaultDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: siteName,
  description: defaultDescription,
  openGraph: {
    title: `${siteName} — ${siteTagline}`,
    description: defaultDescription,
    url: getBaseUrl(),
  },
};

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div>
      <HeroCarousel />
      <FeaturedProducts categories={categories} products={products} />
      <About />
      <HomeFaq />
    </div>
  );
}
