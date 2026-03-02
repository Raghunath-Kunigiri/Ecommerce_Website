import { MenuHero } from "@/components/MenuHero";
import { MenuSection } from "@/components/MenuSection";
import { menu } from "@/data/menu";

export const metadata = {
  title: "Menu",
  description: "Balaji Snacks menu — rotti, snacks, sweets, podulu, and specials.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <MenuHero />

      <div className="mt-12 space-y-14">
        {menu.map((section) => (
          <MenuSection key={section.category} section={section} />
        ))}
      </div>
    </div>
  );
}

