import { FloatingFoodHero } from "@/components/ui/hero-section-7";

export const metadata = {
  title: "Hero Section 7 Demo",
};

export default function FloatingFoodHeroDemoPage() {
  const heroImages = [
    {
      src: "/products/gulab-jamun.svg",
      alt: "Gulab Jamun",
      className:
        "w-40 sm:w-56 md:w-64 lg:w-72 top-10 left-4 sm:left-10 md:top-20 md:left-20 animate-float",
    },
    {
      src: "/Items_Images/Boondi Laddu (Sugar).png",
      alt: "Boondi Laddu",
      className:
        "w-28 sm:w-36 md:w-48 top-10 right-4 sm:right-10 md:top-16 md:right-16 animate-float",
    },
    {
      src: "/Items_Images/Besan Laddu.png",
      alt: "Besan Laddu",
      className:
        "w-32 sm:w-40 md:w-56 bottom-8 right-5 sm:right-10 md:bottom-16 md:right-20 animate-float",
    },
    {
      src: "/Items_Images/Nuvvula Laddu.png",
      alt: "Nuvvula Laddu",
      className: "w-10 sm:w-12 top-1/4 left-1/3 animate-float",
    },
    {
      src: "/Items_Images/Oats Laddu.png",
      alt: "Oats Laddu",
      className: "w-10 sm:w-11 top-1/2 right-1/4 animate-float",
    },
    {
      src: "/Items_Images/Nuvvula Laddu (Jaggery).png",
      alt: "Nuvvula Laddu (Jaggery)",
      className: "w-10 sm:w-11 top-3/4 left-1/4 animate-float",
    },
  ];

  return (
    <div className="w-full">
      <FloatingFoodHero
        title="Traditional sweets, made with love"
        description="Gulab Jamun, laddus, and handmade classics — freshly prepared and packed for every celebration."
        images={heroImages}
      />
    </div>
  );
}

