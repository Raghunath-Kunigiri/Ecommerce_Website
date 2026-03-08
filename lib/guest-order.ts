/**
 * Guest order helpers: order ID format BLJ + 6 digits, delivery fee (free above ₹500).
 */

export const ORDER_ID_PREFIX = "BLJ";
export const FREE_DELIVERY_THRESHOLD_CENTS = 50000; // ₹500
export const DELIVERY_FEE_CENTS = 5000; // ₹50 when below threshold

export const GUEST_ORDER_STATUSES = [
  "CONFIRMED",
  "PREPARING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
] as const;
export type GuestOrderStatusValue = (typeof GUEST_ORDER_STATUSES)[number];

export type GuestOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

/** Generate unique order ID: BLJ + 6 random digits. */
export function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${ORDER_ID_PREFIX}${n}`;
}

export function getDeliveryFeeCents(subtotalCents: number): number {
  return subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;
}

export function getEstimatedDeliveryDays(): number {
  return 3;
}
