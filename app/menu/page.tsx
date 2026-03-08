import type { Metadata } from "next";
import { MenuHero } from "@/components/MenuHero";
import { MenuSection } from "@/components/MenuSection";
import { menu } from "@/data/menu";
import { getBaseUrl, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Balaji Snacks full menu — rotti, snacks, sweets, podulu, hot items, and specials. Traditional mithai and namkeen.",
  openGraph: {
    title: `Menu • ${siteName}`,
    description:
      "Full menu: rotti, snacks, sweets, podulu, hot items, and specials. Traditional mithai and namkeen.",
    url: `${getBaseUrl()}/menu`,
  },
  alternates: { canonical: `${getBaseUrl()}/menu` },
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

