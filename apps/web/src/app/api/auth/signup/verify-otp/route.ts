import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySignupOtp, SESSION_COOKIE } from "@/lib/server/auth";

const schema = z.object({
  email: z.string().email(), phone: z.string().min(10).max(13),
  emailCode: z.string().length(6), smsCode: z.string().length(6),
  realName: z.string().min(2).max(100),
});

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } }, { status: 400 });

  try {
    const result = await verifySignupOtp(body.data.email, body.data.phone, body.data.emailCode, body.data.smsCode, body.data.realName);
    const res = NextResponse.json({ success: true, data: { userId: result.userId, nextStep: "setup-profile" } }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, result.sessionToken, { httpOnly: true, secure: process.env["NODE_ENV"] === "production", sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
    const status = code === "INVALID_OTP" ? 401 : code === "COLLEGE_NOT_FOUND" ? 404 : 500;
    return NextResponse.json({ success: false, error: { code, message } }, { status });
  }
}
