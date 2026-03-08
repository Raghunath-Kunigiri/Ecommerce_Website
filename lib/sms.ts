import { getBaseUrl } from "@/lib/seo";
import { formatMoney } from "@/lib/sample-data";

/**
 * MSG91 (India) – send transactional SMS.
 * Env: MSG91_AUTH_KEY, MSG91_SENDER_ID (optional, 6 chars).
 * Or Twilio: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.
 */

const MSG91_URL = "https://api.msg91.com/api/v5/flow/";

function getIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return `91${digits.slice(-10)}`;
}

export async function sendOrderConfirmationSms(params: {
  phone: string;
  orderId: string;
  totalCents: number;
}): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  const trackUrl = `${baseUrl}/track?id=${params.orderId}`;
  const total = formatMoney(params.totalCents);
  const message = `Balaji Sweets: Order ${params.orderId} confirmed. Total ${total}. Track: ${trackUrl}`;
  return sendSms(getIndianPhone(params.phone), message);
}

export async function sendStatusUpdateSms(params: {
  phone: string;
  orderId: string;
  status: string;
}): Promise<{ ok: boolean; error?: string }> {
  const baseUrl = getBaseUrl();
  const trackUrl = `${baseUrl}/track?id=${params.orderId}`;
  const statusLabel = params.status.replace(/_/g, " ").toLowerCase();
  const message = `Balaji Sweets: Order ${params.orderId} is now ${statusLabel}. Track: ${trackUrl}`;
  return sendSms(getIndianPhone(params.phone), message);
}

async function sendSms(to: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;

  if (twilioSid && twilioToken && twilioFrom) {
    return sendViaTwilio(to, message, twilioFrom, twilioSid, twilioToken);
  }
  if (authKey) {
    return sendViaMsg91(to, message, authKey);
  }
  // No provider configured – log and succeed so checkout still works
  if (process.env.NODE_ENV === "development") {
    console.log("[SMS] No MSG91/Twilio config. Would send to", to, ":", message);
  }
  return { ok: true };
}

async function sendViaMsg91(
  to: string,
  message: string,
  authKey: string,
): Promise<{ ok: boolean; error?: string }> {
  const senderId = (process.env.MSG91_SENDER_ID ?? "BALAJI").slice(0, 6);
  try {
    const res = await fetch("https://api.msg91.com/api/v2/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: senderId,
        route: "4",
        country: "91",
        sms: [{ message, to: [to.replace(/^91/, "")] }],
        authkey: authKey,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { type?: string; message?: string };
    if (!res.ok) return { ok: false, error: data.message ?? `MSG91 ${res.status}` };
    if (data.type === "error") return { ok: false, error: data.message ?? "MSG91 error" };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "MSG91 request failed";
    return { ok: false, error: msg };
  }
}

async function sendViaTwilio(
  to: string,
  body: string,
  from: string,
  accountSid: string,
  authToken: string,
): Promise<{ ok: boolean; error?: string }> {
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: new URLSearchParams({ To: `+${to}`, From: from, Body: body }),
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string; error_message?: string };
    if (!res.ok) return { ok: false, error: data.error_message ?? data.message ?? `Twilio ${res.status}` };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Twilio request failed";
    return { ok: false, error: msg };
  }
}
