export type CategorySlug =
  | "sweets"
  | "snacks"
  | "namkeen"
  | "bakery"
  | "chocolates"
  | "beverages";

export type Category = {
  id: string;
  name: string;
  slug: CategorySlug;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in cents
  category: CategorySlug;
  images: string[];
  isFeatured?: boolean;
  tags?: string[];
};

