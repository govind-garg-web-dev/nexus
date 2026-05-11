/**
 * IDENTITY SCHEMA — Maximum security zone.
 *
 * Rules:
 * - ONLY the auth service and reveal service may query these tables.
 * - NO direct API exposure. Ever.
 * - Joined to public schema ONLY via internal UUID, ONLY inside the reveal service.
 * - Database role `auth_service` is the only role granted SELECT on this schema.
 */

import {
  pgSchema,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const identitySchema = pgSchema("identity");

export const kycStatusEnum = pgEnum("kyc_status", [
  "none",
  "pending",
  "verified",
  "rejected",
]);

/**
 * The single source of truth for a real human being.
 * Never returned in any API response. Period.
 */
export const users = identitySchema.table("users", {
  // The only ID that crosses schema boundaries — an opaque UUID.
  // Never expose this directly; always use a signed, short-lived token.
  id: uuid("id").primaryKey().defaultRandom(),

  realName: text("real_name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  phone: text("phone").notNull().unique(),
  phoneVerified: boolean("phone_verified").notNull().default(false),

  // College-assigned email domain (e.g. "bits-pilani.ac.in")
  collegeDomain: text("college_domain").notNull(),
  collegeId: uuid("college_id").notNull(),

  // Photo stored in R2; URL only visible after a verified reveal
  photoUrl: text("photo_url"),

  // KYC required only for users without a proper institutional email
  kycStatus: kycStatusEnum("kyc_status").notNull().default("none"),
  kycDocUrl: text("kyc_doc_url"),

  // Tracks device fingerprint hash for multi-account detection
  deviceHash: text("device_hash"),
  phoneHash: text("phone_hash"), // Used for permanent block lists

  // Account lifecycle
  isActive: boolean("is_active").notNull().default(true),
  isSuspended: boolean("is_suspended").notNull().default(false),
  suspendedReason: text("suspended_reason"),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),

  // Re-verification every 12 months for graduating students
  reverifyAt: timestamp("reverify_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * OTP tokens for email + SMS verification.
 * Short-lived, single-use, deleted on consumption.
 */
export const otpTokens = identitySchema.table("otp_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"), // Null until user row is created (pre-signup OTPs)
  target: text("target").notNull(), // email address or phone number
  channel: text("channel", { enum: ["email", "sms"] }).notNull(),
  code: text("code").notNull(), // Hashed, not plaintext
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Sessions — kept in identity schema because they contain the user's real ID.
 */
export const sessions = identitySchema.table("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull().unique(), // Signed, hashed token
  deviceHash: text("device_hash"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Reveal log — every identity reveal is immutably recorded.
 */
export const revealLog = identitySchema.table("reveal_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").notNull(),
  requesterUserId: uuid("requester_user_id").notNull(),
  revealedUserId: uuid("revealed_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
