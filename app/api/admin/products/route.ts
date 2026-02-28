import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().int().min(1),
  currency: z.string().min(3).max(3).default("INR"),
  images: z.array(z.string().min(1)).min(1),
  categoryId: z.string().min(1),
  isActive: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const items = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const created = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      currency: parsed.data.currency.toUpperCase(),
      images: parsed.data.images,
      tags: parsed.data.tags ?? [],
      categoryId: parsed.data.categoryId,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json({ item: created });
}

