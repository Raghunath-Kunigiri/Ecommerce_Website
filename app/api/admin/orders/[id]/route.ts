import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const patchSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "FULFILLED", "CANCELLED", "REFUNDED"]),
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

  const updated = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ item: updated });
}

