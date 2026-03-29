import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog";

/** Public catalog JSON for client-side upsell / pickers (same data as shop pages). */
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 },
    );
  }
}
