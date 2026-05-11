const AUTH_KEY = process.env["MSG91_AUTH_KEY"] ?? "";
const TEMPLATE_ID = process.env["MSG91_TEMPLATE_ID"] ?? "";

export async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const normalized = normalizeIndianPhone(phone);
  const res = await fetch("https://api.msg91.com/api/v5/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id: TEMPLATE_ID, mobile: normalized, authkey: AUTH_KEY, otp: code }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MSG91 SMS failed: ${body}`);
  }
}

function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  throw new Error(`Invalid Indian phone number: ${phone}`);
}

export function isValidIndianPhone(phone: string): boolean {
  try { normalizeIndianPhone(phone); return true; } catch { return false; }
}
