import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendStatusUpdateEmail } from "@/lib/email";
import { sendStatusUpdateSms } from "@/lib/sms";
import { getBaseUrl } from "@/lib/seo";
import { GUEST_ORDER_STATUSES } from "@/lib/guest-order";

const patchSchema = z.object({
  status: z.enum(GUEST_ORDER_STATUSES as unknown as [string, ...string[]]),
});

type Ctx = { params: Promise<{ orderId: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.res;

  const { orderId } = await ctx.params;
  const id = (orderId ?? "").trim().toUpperCase();
  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status", issues: parsed.error.issues }, { status: 400 });
  }

  const order = await prisma.guestOrder.findUnique({ where: { orderId: id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updated = await prisma.guestOrder.update({
    where: { orderId: id },
    data: { status: parsed.data.status as (typeof GUEST_ORDER_STATUSES)[number] },
  });

  const trackUrl = `${getBaseUrl()}/track?id=${encodeURIComponent(updated.orderId)}`;
  const statusLabel = updated.status.replace(/_/g, " ");

  await Promise.all([
    sendStatusUpdateEmail({
      to: updated.email,
      orderId: updated.orderId,
      customerName: updated.customerName,
      status: statusLabel,
      trackUrl,
    }),
    sendStatusUpdateSms({
      phone: updated.phone,
      orderId: updated.orderId,
      status: statusLabel,
    }),
  ]);

  return NextResponse.json({ item: updated });
}
