import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const topKParam = url.searchParams.get("topK");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId query parameter" },
      { status: 400 },
    );
  }

  const topK = Number.isNaN(Number(topKParam)) ? 4 : Number(topKParam);

  const baseUrl =
    process.env.ML_RECOMMENDER_URL ?? "http://localhost:8000";

  let recIds: string[] = [];
  try {
    const res = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/recommend/${encodeURIComponent(productId)}?top_k=${topK}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Recommender service error" },
        { status: res.status },
      );
    }
    const data = (await res.json()) as { recommended?: string[] };
    recIds = Array.isArray(data.recommended) ? data.recommended : [];
  } catch {
    return NextResponse.json(
      { error: "Unable to reach recommender service" },
      { status: 502 },
    );
  }

  const products = await getProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const recommended = recIds
    .map((id) => bySlug.get(id))
    .filter(Boolean)
    .slice(0, topK);

  return NextResponse.json({ recommended });
}

