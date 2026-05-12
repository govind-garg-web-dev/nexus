import { NextResponse } from "next/server";
import { z } from "zod";
import { requestLoginOtp } from "@/lib/server/auth";

export async function POST(req: Request) {
  const body = z.object({ email: z.string().email() }).safeParse(await req.json());
  if (!body.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: body.error.message } }, { status: 400 });
  const result = await requestLoginOtp(body.data.email);
  return NextResponse.json({ success: true, data: result });
}
