import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env["RESEND_API_KEY"]);
  return _resend;
}
function getFrom(): string {
  return process.env["EMAIL_FROM"] ?? "noreply@nexus.app";
}

export async function sendEmailOtp(email: string, code: string): Promise<void> {
  await getResend().emails.send({
    from: getFrom(),
    to: email,
    subject: `${code} is your Nexus verification code`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#09090b;color:#fafafa;border-radius:12px;">
        <h1 style="font-size:24px;margin-bottom:8px;color:#a78bfa;">Nexus</h1>
        <p style="color:#a1a1aa;margin-bottom:24px;">Anonymous Merit-Based Campus Network</p>
        <div style="background:#18181b;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
          <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;">Your verification code</p>
          <span style="font-size:40px;font-weight:700;letter-spacing:8px;color:#fafafa;">${code}</span>
          <p style="margin:16px 0 0;color:#71717a;font-size:12px;">Expires in 10 minutes</p>
        </div>
        <p style="color:#71717a;font-size:12px;text-align:center;">If you didn't request this, ignore this email. Never share this code.</p>
      </div>`,
  });
}
