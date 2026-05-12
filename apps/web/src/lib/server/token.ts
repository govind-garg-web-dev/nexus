import { createHash, randomBytes } from "crypto";

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
export function sessionExpiresAt(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}
export function otpExpiresAt(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
