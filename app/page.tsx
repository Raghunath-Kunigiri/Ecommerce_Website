import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { About } from "@/components/home/about";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <About />
    </div>
  );
}
