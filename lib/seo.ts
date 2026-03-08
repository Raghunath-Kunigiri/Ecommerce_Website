/**
 * Canonical base URL for the site. Used for sitemap, robots, Open Graph, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://likithasweets.com).
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteName = "Balaji Sweets";
export const siteTagline = "Premium Sweets & Snacks — Handcrafted with care";
export const defaultDescription =
  "Order premium Indian sweets, snacks, namkeen, and gift boxes. Fresh, hygienic, and delivered. Best mithai and traditional treats for festivals and every day.";

export const defaultKeywords = [
  "Indian sweets",
  "mithai",
  "namkeen",
  "snacks",
  "gift boxes",
  "festival sweets",
  "traditional sweets",
  "fresh sweets",
  "Balaji Sweets",
  "Balaji Snacks",
];

/** Open Graph image dimensions (recommended 1200x630) */
export const ogImageWidth = 1200;
export const ogImageHeight = 630;
