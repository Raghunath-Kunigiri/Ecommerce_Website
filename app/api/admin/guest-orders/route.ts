import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const items = await prisma.guestOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({
    items: items.map((o) => ({
      id: o.id,
      orderId: o.orderId,
      customerName: o.customerName,
      phone: o.phone,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
