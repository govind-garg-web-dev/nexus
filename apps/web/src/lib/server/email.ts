import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env["RESEND_API_KEY"]);
  return _resend;
}

export async function sendEmailOtp(email: string, code: string): Promise<void> {
  await getResend().emails.send({
    from: process.env["EMAIL_FROM"] ?? "noreply@nexus.app",
    to: email,
    subject: `${code} is your Nexus verification code`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#09090b;color:#fafafa;border-radius:12px;"><h1 style="color:#a78bfa;">Nexus</h1><div style="background:#18181b;border-radius:8px;padding:24px;text-align:center;"><p style="color:#a1a1aa;font-size:14px;">Your verification code</p><span style="font-size:40px;font-weight:700;letter-spacing:8px;">${code}</span><p style="color:#71717a;font-size:12px;margin-top:16px;">Expires in 10 minutes</p></div></div>`,
  });
}
