import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyLoginOtp, SESSION_COOKIE } from "@/lib/server/auth";

export async function POST(req: Request) {
  const body = z.object({ email: z.string().email(), code: z.string().length(6) }).safeParse(await req.json());
  if (!body.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } }, { status: 400 });

  try {
    const result = await verifyLoginOtp(body.data.email, body.data.code);
    const res = NextResponse.json({ success: true, data: { userId: result.userId, isProfileComplete: result.isProfileComplete, nextStep: result.isProfileComplete ? "feed" : "setup-profile" } });
    res.cookies.set(SESSION_COOKIE, result.sessionToken, { httpOnly: true, secure: process.env["NODE_ENV"] === "production", sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
    const status = code === "INVALID_OTP" ? 401 : code === "SUSPENDED" ? 403 : 500;
    return NextResponse.json({ success: false, error: { code, message } }, { status });
  }
}
