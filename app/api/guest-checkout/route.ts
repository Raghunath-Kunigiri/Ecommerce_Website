import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  generateOrderId,
  getDeliveryFeeCents,
  getEstimatedDeliveryDays,
  type GuestOrderItem,
} from "@/lib/guest-order";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderConfirmationSms } from "@/lib/sms";

const guestCheckoutSchema = z.object({
  customerName: z.string().min(1, "Full name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit mobile number")
    .max(15)
    .regex(/^[6-9]\d{9}$|^(\+91|91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  address: z.string().min(5, "Delivery address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6).regex(/^\d{6}$/, "Invalid pincode"),
  notes: z.string().max(500).optional().default(""),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().int().min(0),
      quantity: z.number().int().min(1),
      image: z.string().optional(),
    }),
  ).min(1, "Cart is empty"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = guestCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg = Object.values(first).flat().join(" ") || "Invalid request";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { customerName, email, phone, address, city, pincode, notes, items } = parsed.data;

    const subtotalCents = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFeeCents = getDeliveryFeeCents(subtotalCents);
    const totalCents = subtotalCents + deliveryFeeCents;

    const itemsForDb: GuestOrderItem[] = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    let orderId = generateOrderId();
    let exists = await prisma.guestOrder.findUnique({ where: { orderId } });
    while (exists) {
      orderId = generateOrderId();
      exists = await prisma.guestOrder.findUnique({ where: { orderId } });
    }

    await prisma.guestOrder.create({
      data: {
        orderId,
        customerName,
        email,
        phone: phone.replace(/\D/g, "").slice(-10),
        address,
        city,
        pincode,
        items: itemsForDb as unknown as object,
        subtotal: subtotalCents,
        deliveryFee: deliveryFeeCents,
        total: totalCents,
        notes: notes || null,
      },
    });

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + getEstimatedDeliveryDays());
    const estimatedDeliveryDate = estimatedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const [emailResult, smsResult] = await Promise.all([
      sendOrderConfirmationEmail({
        to: email,
        orderId,
        customerName,
        items: itemsForDb,
        totalCents,
        estimatedDeliveryDate,
      }),
      sendOrderConfirmationSms({ phone, orderId, totalCents }),
    ]);

    if (!emailResult.ok && process.env.NODE_ENV === "production") {
      console.error("[guest-checkout] Email failed:", emailResult.error);
    }
    if (!smsResult.ok && process.env.NODE_ENV === "production") {
      console.error("[guest-checkout] SMS failed:", smsResult.error);
    }

    return NextResponse.json({ orderId, success: true });
  } catch (e) {
    console.error("[guest-checkout]", e);
    return NextResponse.json(
      { error: "Unable to place order. Please try again." },
      { status: 500 },
    );
  }
}
