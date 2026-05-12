export async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `+91${digits}` : digits.startsWith("91") && digits.length === 12 ? `+${digits}` : null;
  if (!normalized) throw new Error("Invalid Indian phone number");

  const res = await fetch("https://api.msg91.com/api/v5/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id: process.env["MSG91_TEMPLATE_ID"], mobile: normalized, authkey: process.env["MSG91_AUTH_KEY"], otp: code }),
  });
  if (!res.ok) throw new Error(`MSG91 failed: ${await res.text()}`);
}

export function isValidIndianPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 || (d.startsWith("91") && d.length === 12);
}
