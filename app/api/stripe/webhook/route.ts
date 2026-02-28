import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
  }

  const payload = await req.text();
  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const itemsRaw = session?.metadata?.items;
    const userId = session?.metadata?.userId || null;
    const orderId = session?.metadata?.orderId || null;
    const amountTotal = session?.amount_total as number | null;
    const currency = (session?.currency as string | null) ?? "usd";

    if (!itemsRaw || typeof amountTotal !== "number") {
      return NextResponse.json({ received: true });
    }

    const items = (() => {
      try {
        const parsed = JSON.parse(itemsRaw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return [];
    })() as Array<{ productId: string; quantity: number }>;

    if (items.length === 0) return NextResponse.json({ received: true });

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ received: true });
    }

    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, images: true },
    });
    const productById = new Map(dbProducts.map((p) => [p.id, p]));

    const createItems = items.flatMap((i) => {
      const p = productById.get(i.productId);
      if (!p) return [];
      return [
        {
          productId: p.id,
          name: p.name,
          price: p.price,
          quantity: Math.max(1, Math.floor(i.quantity || 1)),
          image: p.images?.[0] ?? null,
        },
      ];
    });

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          total: amountTotal,
          currency: currency.toUpperCase(),
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          userId,
        },
      });
    } else {
      const existing = await prisma.order.findFirst({
        where: { stripeCheckoutSessionId: session.id },
        select: { id: true },
      });
      if (existing) {
        await prisma.order.update({
          where: { id: existing.id },
          data: {
            status: "PAID",
            total: amountTotal,
            currency: currency.toUpperCase(),
            stripePaymentIntentId: paymentIntentId,
            userId,
          },
        });
      } else {
        await prisma.order.create({
          data: {
            status: "PAID",
            total: amountTotal,
            currency: currency.toUpperCase(),
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            userId,
            items: {
              create: createItems,
            },
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

