import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const items = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const created = await prisma.category.create({
    data: { name: parsed.data.name, slug: parsed.data.slug },
  });

  return NextResponse.json({ item: created });
}

