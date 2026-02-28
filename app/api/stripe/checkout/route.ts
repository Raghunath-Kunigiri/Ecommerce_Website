import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";

import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { products as sampleProducts } from "@/lib/sample-data";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id ?? null;

  const ids = parsed.data.items.map((i) => i.productId);
  const dbProducts = process.env.DATABASE_URL
    ? await prisma.product.findMany({
        where: { id: { in: ids }, isActive: true },
        select: { id: true, name: true, description: true, price: true, images: true, currency: true },
      })
    : [];

  const productById = new Map<string, { id: string; name: string; description: string; price: number; images: string[]; currency: string }>();
  for (const p of dbProducts) productById.set(p.id, p);
  if (productById.size === 0) {
    for (const p of sampleProducts) {
      productById.set(p.id, {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        currency: "INR",
      });
    }
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const computedTotal = parsed.data.items.reduce((sum, i) => {
    const p = productById.get(i.productId);
    if (!p) return sum;
    return sum + p.price * i.quantity;
  }, 0);

  let orderId: string | null = null;
  if (process.env.DATABASE_URL) {
    const createItems = parsed.data.items.flatMap((i) => {
      const p = productById.get(i.productId);
      if (!p) return [];
      return [
        {
          productId: p.id,
          name: p.name,
          price: p.price,
          quantity: i.quantity,
          image: p.images?.[0] ?? null,
        },
      ];
    });

    const created = await prisma.order.create({
      data: {
        status: "PENDING",
        total: computedTotal,
        currency: "INR",
        userId,
        items: { create: createItems },
      },
      select: { id: true },
    });
    orderId = created.id;
  }

  const line_items = parsed.data.items.flatMap((i) => {
    const p = productById.get(i.productId);
    if (!p) return [];
    return [
      {
        quantity: i.quantity,
        price_data: {
          currency: (p.currency ?? "INR").toLowerCase(),
          unit_amount: p.price,
          product_data: {
            name: p.name,
            description: p.description,
            images: p.images?.slice(0, 1) ?? [],
          },
        },
      } as const,
    ];
  });

  if (line_items.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      userId: userId ?? "",
      items: JSON.stringify(parsed.data.items),
      orderId: orderId ?? "",
    },
  });

  if (process.env.DATABASE_URL && orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { stripeCheckoutSessionId: checkout.id },
    });
  }

  return NextResponse.json({ url: checkout.url });
}

