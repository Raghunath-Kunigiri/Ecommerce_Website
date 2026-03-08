import { Resend } from "resend";
import { getBaseUrl } from "@/lib/seo";
import { formatMoney } from "@/lib/sample-data";
import type { GuestOrderItem } from "@/lib/guest-order";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "orders@balajisweets.com";

const saffron = "#E8862A";
const gold = "#F5C842";
const deepBrown = "#3B1F0A";
const cream = "#FDF6E3";

function itemRows(items: GuestOrderItem[]): string {
  return items
    .map(
      (i) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${formatMoney(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
  items: GuestOrderItem[];
  totalCents: number;
  estimatedDeliveryDate: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) return { ok: false, error: "Resend not configured" };
  const baseUrl = getBaseUrl();
  const trackUrl = `${baseUrl}/track?id=${encodeURIComponent(params.orderId)}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:system-ui,sans-serif;background:${cream};color:${deepBrown};padding:20px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(59,31,10,0.08)">
    <div style="background:linear-gradient(135deg,${saffron},${gold});padding:24px;text-align:center">
      <h1 style="margin:0;font-size:24px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.2)">Balaji Sweets</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.95);font-size:14px">Order Confirmed</p>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 16px">Hi ${escapeHtml(params.customerName)},</p>
      <p style="margin:0 0 20px">Your order has been placed successfully.</p>
      <p style="margin:0 0 8px;font-size:12px;color:#666">Order ID</p>
      <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:${saffron}">${escapeHtml(params.orderId)}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:${cream}"><th style="padding:10px 12px;text-align:left">Item</th><th style="padding:10px 12px;text-align:center">Qty</th><th style="padding:10px 12px;text-align:right">Amount</th></tr></thead>
        <tbody>${itemRows(params.items)}</tbody>
      </table>
      <p style="margin:0 0 4px;text-align:right;font-weight:700;font-size:18px">Total: ${formatMoney(params.totalCents)}</p>
      <p style="margin:16px 0 0;font-size:14px;color:#666">Estimated delivery: ${escapeHtml(params.estimatedDeliveryDate)}</p>
      <p style="margin:24px 0 0"><a href="${trackUrl}" style="display:inline-block;background:${saffron};color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:600">Track your order</a></p>
    </div>
    <div style="padding:16px 24px;background:${cream};font-size:12px;color:#666;text-align:center">
      Thank you for ordering from Balaji Sweets.
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: `Order ${params.orderId} confirmed – Balaji Sweets`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: msg };
  }
}

export async function sendStatusUpdateEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
  status: string;
  trackUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) return { ok: false, error: "Resend not configured" };

  const statusLabel = params.status.replace(/_/g, " ").toLowerCase();
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;font-family:system-ui,sans-serif;background:${cream};color:${deepBrown};padding:20px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(59,31,10,0.08)">
    <div style="background:linear-gradient(135deg,${saffron},${gold});padding:20px;text-align:center">
      <h1 style="margin:0;font-size:20px;color:#fff">Balaji Sweets</h1>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 12px">Hi ${escapeHtml(params.customerName)},</p>
      <p style="margin:0 0 8px">Your order <strong>${escapeHtml(params.orderId)}</strong> is now: <strong>${escapeHtml(statusLabel)}</strong>.</p>
      <p style="margin:20px 0 0"><a href="${params.trackUrl}" style="display:inline-block;background:${saffron};color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Track order</a></p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: `Order ${params.orderId} – ${statusLabel}`,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed";
    return { ok: false, error: msg };
  }
}
