import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "@nexus/db";
import { identitySchema, publicSchema } from "@nexus/db";
import { isEmailDomainAllowed, getDomainFromEmail } from "./college-domains";
import { generateOtpCode, hashOtp, verifyOtp, otpExpiresAt } from "./otp";
import { generateSessionToken, hashToken, sessionExpiresAt } from "./token";
import { createHash } from "crypto";
import { sendEmailOtp } from "./email";
import { sendSmsOtp, isValidIndianPhone } from "./sms";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "nexus_session";

// ─── Device hash ─────────────────────────────────────────────────────────────
export function hashPhone(phone: string): string {
  return createHash("sha256").update(phone.replace(/\D/g, "")).digest("hex");
}

// ─── Session helpers ──────────────────────────────────────────────────────────
export async function getSessionUser(): Promise<{ userId: string; collegeId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const hashed = hashToken(token);
  const now = new Date();

  const session = await db.query.sessions.findFirst({
    where: and(
      eq(identitySchema.sessions.token, hashed),
      isNull(identitySchema.sessions.revokedAt),
      gt(identitySchema.sessions.expiresAt, now),
    ),
  });
  if (!session) return null;

  const user = await db.query.users.findFirst({
    where: and(eq(identitySchema.users.id, session.userId), eq(identitySchema.users.isActive, true)),
  });
  if (!user || user.isSuspended) return null;
  return { userId: user.id, collegeId: user.collegeId };
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export async function requestSignupOtp(email: string, phone: string) {
  const normalizedEmail = email.toLowerCase().trim();
  if (!isEmailDomainAllowed(normalizedEmail))
    throw new Error("DOMAIN_BLOCKED: Only institutional college email addresses are allowed.");
  if (!isValidIndianPhone(phone))
    throw new Error("INVALID_PHONE: Please enter a valid 10-digit Indian mobile number.");

  const existing = await db.query.users.findFirst({ where: eq(identitySchema.users.email, normalizedEmail) });
  if (existing?.isActive) throw new Error("ALREADY_EXISTS: An account with this email already exists.");

  const emailCode = generateOtpCode();
  const smsCode = generateOtpCode();

  await db.insert(identitySchema.otpTokens).values([
    { target: normalizedEmail, channel: "email", code: hashOtp(emailCode), expiresAt: otpExpiresAt() },
    { target: phone, channel: "sms", code: hashOtp(smsCode), expiresAt: otpExpiresAt() },
  ]);

  await Promise.all([sendEmailOtp(normalizedEmail, emailCode), sendSmsOtp(phone, smsCode)]);
  return { message: "OTP sent to your email and phone." };
}

export async function verifySignupOtp(email: string, phone: string, emailCode: string, smsCode: string, realName: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date();

  const [emailOtp, smsOtp] = await Promise.all([
    db.query.otpTokens.findFirst({ where: and(eq(identitySchema.otpTokens.target, normalizedEmail), eq(identitySchema.otpTokens.channel, "email"), isNull(identitySchema.otpTokens.consumedAt), gt(identitySchema.otpTokens.expiresAt, now)) }),
    db.query.otpTokens.findFirst({ where: and(eq(identitySchema.otpTokens.target, phone), eq(identitySchema.otpTokens.channel, "sms"), isNull(identitySchema.otpTokens.consumedAt), gt(identitySchema.otpTokens.expiresAt, now)) }),
  ]);

  if (!emailOtp || !verifyOtp(emailCode, emailOtp.code)) throw new Error("INVALID_OTP: Email code is incorrect or expired.");
  if (!smsOtp || !verifyOtp(smsCode, smsOtp.code)) throw new Error("INVALID_OTP: SMS code is incorrect or expired.");

  const domain = getDomainFromEmail(normalizedEmail)!;
  const college = await db.query.colleges.findFirst({ where: eq(publicSchema.colleges.domain, domain) });
  if (!college) throw new Error("COLLEGE_NOT_FOUND: Your college has not been onboarded yet.");

  const [newUser] = await db.insert(identitySchema.users).values({
    realName, email: normalizedEmail, emailVerified: true, phone, phoneVerified: true,
    collegeDomain: domain, collegeId: college.id, phoneHash: hashPhone(phone),
    lastVerifiedAt: now, reverifyAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
  }).returning({ id: identitySchema.users.id });

  if (!newUser) throw new Error("INTERNAL: Failed to create user.");

  await Promise.all([
    db.update(identitySchema.otpTokens).set({ consumedAt: now, userId: newUser.id }).where(eq(identitySchema.otpTokens.id, emailOtp.id)),
    db.update(identitySchema.otpTokens).set({ consumedAt: now, userId: newUser.id }).where(eq(identitySchema.otpTokens.id, smsOtp.id)),
  ]);

  const sessionToken = generateSessionToken();
  await db.insert(identitySchema.sessions).values({ userId: newUser.id, token: hashToken(sessionToken), expiresAt: sessionExpiresAt() });

  return { sessionToken, userId: newUser.id };
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function requestLoginOtp(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await db.query.users.findFirst({ where: and(eq(identitySchema.users.email, normalizedEmail), eq(identitySchema.users.isActive, true)) });
  if (!user || user.isSuspended) return { message: "If an account exists, an OTP has been sent." };

  const code = generateOtpCode();
  await db.insert(identitySchema.otpTokens).values({ userId: user.id, target: normalizedEmail, channel: "email", code: hashOtp(code), expiresAt: otpExpiresAt() });
  await sendEmailOtp(normalizedEmail, code);
  return { message: "If an account exists, an OTP has been sent." };
}

export async function verifyLoginOtp(email: string, code: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date();

  const user = await db.query.users.findFirst({ where: eq(identitySchema.users.email, normalizedEmail) });
  if (!user) throw new Error("INVALID_OTP: Code is incorrect or expired.");
  if (user.isSuspended) throw new Error("SUSPENDED: Your account has been suspended.");

  const otp = await db.query.otpTokens.findFirst({ where: and(eq(identitySchema.otpTokens.userId, user.id), eq(identitySchema.otpTokens.channel, "email"), isNull(identitySchema.otpTokens.consumedAt), gt(identitySchema.otpTokens.expiresAt, now)) });
  if (!otp || !verifyOtp(code, otp.code)) throw new Error("INVALID_OTP: Code is incorrect or expired.");

  await db.update(identitySchema.otpTokens).set({ consumedAt: now }).where(eq(identitySchema.otpTokens.id, otp.id));

  const sessionToken = generateSessionToken();
  await db.insert(identitySchema.sessions).values({ userId: user.id, token: hashToken(sessionToken), expiresAt: sessionExpiresAt() });

  const profile = await db.query.profiles.findFirst({ where: eq(publicSchema.profiles.userId, user.id) });
  return { sessionToken, userId: user.id, isProfileComplete: profile?.isReadyForFeed ?? false };
}

export async function revokeSession(token: string): Promise<void> {
  await db.update(identitySchema.sessions).set({ revokedAt: new Date() }).where(eq(identitySchema.sessions.token, hashToken(token)));
}
