import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const updated = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { id } = await ctx.params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

