import { HeroCarousel } from "@/components/home/hero-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import { About } from "@/components/home/about";
import { getCategories, getProducts } from "@/lib/catalog";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div>
      <HeroCarousel />
      <FeaturedProducts categories={categories} products={products} />
      <About />
    </div>
  );
}
