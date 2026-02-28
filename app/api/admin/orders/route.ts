import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const items = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
    take: 100,
  });
  return NextResponse.json({ items });
}

