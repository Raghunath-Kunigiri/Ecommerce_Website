import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().int().min(1).optional(),
  currency: z.string().min(3).max(3).optional(),
  images: z.array(z.string().min(1)).min(1).optional(),
  categoryId: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  const item = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      currency: parsed.data.currency ? parsed.data.currency.toUpperCase() : undefined,
      tags: parsed.data.tags ?? undefined,
    },
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

