import { HeroCarousel } from "@/components/home/hero-carousel";
import { CraftStrip } from "@/components/home/craft-strip";
import { FeaturedProducts } from "@/components/home/featured-products";
import { About } from "@/components/home/about";
import { getCategories, getProducts } from "@/lib/catalog";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div>
      <HeroCarousel />
      <CraftStrip />
      <FeaturedProducts categories={categories} products={products} />
      <About />
    </div>
  );
}
