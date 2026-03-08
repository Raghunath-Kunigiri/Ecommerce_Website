import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEstimatedDeliveryDays } from "@/lib/guest-order";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const id = (orderId ?? "").trim().toUpperCase();
  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  const order = await prisma.guestOrder.findUnique({
    where: { orderId: id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const created = new Date(order.createdAt);
  const estimatedDate = new Date(created);
  estimatedDate.setDate(estimatedDate.getDate() + getEstimatedDeliveryDays());
  const estimatedDeliveryDate = estimatedDate.toISOString().slice(0, 10);

  return NextResponse.json({
    orderId: order.orderId,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    pincode: order.pincode,
    items: order.items as Array<{ productId: string; name: string; price: number; quantity: number; image?: string }>,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    estimatedDeliveryDate,
  });
}
