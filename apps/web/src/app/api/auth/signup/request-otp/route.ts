import { NextResponse } from "next/server";
import { z } from "zod";
import { requestSignupOtp } from "@/lib/server/auth";

const schema = z.object({ email: z.string().email(), phone: z.string().min(10).max(13) });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } }, { status: 400 });

  try {
    const result = await requestSignupOtp(body.data.email, body.data.phone);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const [code, message] = msg.includes(":") ? msg.split(": ", 2) : ["ERROR", msg];
    const status = code === "DOMAIN_BLOCKED" || code === "INVALID_PHONE" ? 400 : code === "ALREADY_EXISTS" ? 409 : 500;
    return NextResponse.json({ success: false, error: { code, message } }, { status });
  }
}
