// app/api/recommend/route.js  (Next.js App Router)

import { buildProductContext } from "@/lib/products";
import { getProducts } from "@/lib/catalog";
import { FREE_DELIVERY_THRESHOLD_CENTS } from "@/lib/guest-order";

/** ML-based “You may also like” (used by product pages). */
export async function GET(req) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const topKParam = url.searchParams.get("topK");

  if (!productId) {
    return Response.json(
      { error: "Missing productId query parameter" },
      { status: 400 },
    );
  }

  const topK = Number.isNaN(Number(topKParam)) ? 4 : Number(topKParam);

  const baseUrl = process.env.ML_RECOMMENDER_URL ?? "http://localhost:8000";

  let recIds = [];
  try {
    const res = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/recommend/${encodeURIComponent(productId)}?top_k=${topK}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      return Response.json(
        { error: "Recommender service error" },
        { status: res.status },
      );
    }
    const data = await res.json();
    recIds = Array.isArray(data.recommended) ? data.recommended : [];
  } catch {
    return Response.json(
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

  return Response.json({ recommended });
}

/** Ollama AI assistant (product context + natural-language suggestions). */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { currentProduct, cartItems, question, subtotalCents } = body;

  // Build the system prompt with YOUR actual products
  const productList = buildProductContext();

  const cartLines =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems
          .map((c) => `- ${c?.name ?? "item"} × ${c?.quantity ?? 1}`)
          .join("\n")
      : "";

  const cartRules =
    cartLines.length > 0
      ? `
- The customer ALREADY has these items in their cart — do NOT suggest the same products again as "new" picks:
${cartLines}
- Suggest only complementary add-ons from the catalog (different products) to help them buy more before checkout.
- Be persuasive but honest; keep it concise.`
      : "";

  let deliveryNudge = "";
  if (
    typeof subtotalCents === "number" &&
    subtotalCents > 0 &&
    subtotalCents < FREE_DELIVERY_THRESHOLD_CENTS
  ) {
    const gap = (FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents) / 100;
    deliveryNudge = `\n- Their cart subtotal is below ₹${FREE_DELIVERY_THRESHOLD_CENTS / 100} free delivery. If relevant, mention they are about ₹${gap.toFixed(0)} away from free delivery and suggest affordable add-ons that fit.`;
  }

  const systemPrompt = `You are a helpful assistant for Balaji Sweets & Snacks, 
a traditional Telugu sweet shop from Anantapur. 

Here are ALL our products:
${productList}

Rules:
- Suggest only products from the list above
- Always mention the price (₹)
- Keep suggestions short and friendly
- For festive occasions, suggest sweets
- For snack requests, suggest crispy items
- For healthy options, suggest Oats Laddu, Ragi Rotti, Nuvvula items
- Respond in English (Telugu names in brackets are fine)${cartRules}${deliveryNudge}`;

  const userMessage =
    question ||
    `Customer is viewing ${currentProduct ?? "our shop"}. Suggest 3 related products they might also like, with a short reason for each.`;

  const numPredict =
    Array.isArray(cartItems) && cartItems.length > 0 ? 450 : 300;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: `${systemPrompt}\n\nCustomer query: ${userMessage}`,
        stream: false,
        options: { temperature: 0.7, num_predict: numPredict },
      }),
    });

    const data = await response.json();
    return Response.json({ recommendation: data.response });
  } catch (error) {
    return Response.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
