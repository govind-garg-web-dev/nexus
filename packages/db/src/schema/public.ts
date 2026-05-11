/**
 * PUBLIC SCHEMA — What the world (within a campus) can see.
 *
 * Rules:
 * - All tables are scoped by college_id. Cross-college data is NEVER returned
 *   unless a cross-campus feature flag is explicitly ON for that college pair.
 * - NO real names. NO photos. NO emails. NO phones.
 * - user_id here is the same UUID as identity.users.id — the join ONLY happens
 *   inside the reveal service.
 */

import {
  pgSchema,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  real,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const publicSchema = pgSchema("public_nexus"); // "public" is reserved in Postgres

// ─── Enums ────────────────────────────────────────────────────────────────────

export const skillCategoryEnum = pgEnum("skill_category", [
  "coding_python",
  "coding_js",
  "coding_cpp",
  "coding_java",
  "design",
  "writing",
  "math_dsa",
  "public_speaking",
]);

export const badgeTierEnum = pgEnum("badge_tier", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const matchIntentEnum = pgEnum("match_intent", [
  "project",
  "study",
  "cofounder",
  "general",
  "roommate",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "pending_icebreaker",
  "icebreaker_in_progress",
  "icebreaker_completed",
  "revealed",
  "expired",
  "unmatched",
]);

// ─── Colleges ─────────────────────────────────────────────────────────────────

export const colleges = publicSchema.table("colleges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain").notNull().unique(), // e.g. "bits-pilani.ac.in"
  city: text("city").notNull(),
  state: text("state").notNull(),
  tier: text("tier", { enum: ["tier1", "tier2", "tier3"] }).notNull(),
  studentCount: integer("student_count"),
  isActive: boolean("is_active").notNull().default(false), // Must be manually activated
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const profiles = publicSchema.table("profiles", {
  userId: uuid("user_id").primaryKey(), // FK to identity.users.id — never joined here
  collegeId: uuid("college_id")
    .notNull()
    .references(() => colleges.id),

  pseudonym: text("pseudonym").notNull().unique(),
  branch: text("branch").notNull(),
  batchYear: integer("batch_year").notNull(),
  interests: text("interests").array().notNull().default([]),
  projectLinks: jsonb("project_links")
    .$type<{ url: string; label: string }[]>()
    .notNull()
    .default([]),

  // Reliability score — the most important public number
  reliabilityScore: real("reliability_score").notNull().default(70),
  reliabilityTag: text("reliability_tag", {
    enum: ["Reliable", "Mixed", "Avoid"],
  })
    .notNull()
    .default("Reliable"),

  // Shadow-ban state derived from reliability score
  isShadowBanned: boolean("is_shadow_banned").notNull().default(false),

  // Profile completeness gate (must complete ≥1 skill challenge before appearing in feed)
  isReadyForFeed: boolean("is_ready_for_feed").notNull().default(false),

  // Co-founder mode (unlocked after 2+ verified collaborations)
  isCofounderModeEnabled: boolean("is_cofounder_mode_enabled")
    .notNull()
    .default(false),
  cofounderProfile: jsonb("cofounder_profile").$type<{
    commitmentLevel: string;
    equityComfort: string;
    domain: string;
    problemStatement: string;
  } | null>().default(null),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Skill Badges ──────────────────────────────────────────────────────────────

export const badges = publicSchema.table("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  category: skillCategoryEnum("category").notNull(),
  tier: badgeTierEnum("tier").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  // Badges expire after 18 months
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  isRevoked: boolean("is_revoked").notNull().default(false),
  revokedReason: text("revoked_reason"),
});

// ─── Skill Challenges ─────────────────────────────────────────────────────────

export const skillChallenges = publicSchema.table("skill_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  category: skillCategoryEnum("category").notNull(),
  tier: badgeTierEnum("tier").notNull(),
  status: text("status", {
    enum: ["pending", "in_review", "passed", "failed"],
  }).notNull().default("pending"),
  submissionData: jsonb("submission_data"), // Code submission, file URL, text response
  score: real("score"),
  judgeVerdict: text("judge_verdict"), // Raw verdict from Judge0 or peer review
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
});

// ─── Endorsements ─────────────────────────────────────────────────────────────

export const endorsements = publicSchema.table("endorsements", {
  id: uuid("id").primaryKey().defaultRandom(),
  endorserId: uuid("endorser_id").notNull(),
  endorseeId: uuid("endorsee_id").notNull(),
  category: skillCategoryEnum("category").notNull(),
  // Weight = endorser's reliability score × badge tier level at time of endorsement
  weight: real("weight").notNull(),
  // Collaboration proof — match must exist and be > 7 days old
  matchId: uuid("match_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Matches ──────────────────────────────────────────────────────────────────

export const matches = publicSchema.table("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  user1Id: uuid("user1_id").notNull(),
  user2Id: uuid("user2_id").notNull(),
  intent: matchIntentEnum("intent").notNull(),
  status: matchStatusEnum("status").notNull().default("pending_icebreaker"),
  icebreakerPrompt: text("icebreaker_prompt"),
  user1Answer: text("user1_answer"),
  user2Answer: text("user2_answer"),
  // Set to true once both answers are in + reveal service has been called
  isRevealed: boolean("is_revealed").notNull().default(false),
  revealedAt: timestamp("revealed_at", { withTimezone: true }),
  // Match expires if icebreaker not completed in 72h
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Likes (pre-match swipe events) ───────────────────────────────────────────

export const likes = publicSchema.table("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  likerId: uuid("liker_id").notNull(),
  likedId: uuid("liked_id").notNull(),
  intent: matchIntentEnum("intent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Chat Messages ────────────────────────────────────────────────────────────

export const chatMessages = publicSchema.table("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id),
  senderId: uuid("sender_id").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  // Moderation state
  isFlagged: boolean("is_flagged").notNull().default(false),
  flagReason: text("flag_reason"),
  moderationScore: real("moderation_score"), // Perspective API toxicity score 0–1
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = publicSchema.table("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").notNull(),
  reportedUserId: uuid("reported_user_id").notNull(),
  category: text("category", {
    enum: [
      "harassment",
      "doxxing",
      "impersonation",
      "sexual_content",
      "skill_fraud",
      "ghosting",
      "scam",
    ],
  }).notNull(),
  details: text("details"),
  status: text("status", {
    enum: ["open", "under_review", "resolved_warned", "resolved_banned", "dismissed"],
  }).notNull().default("open"),
  resolvedBy: uuid("resolved_by"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Blocks ───────────────────────────────────────────────────────────────────

export const blocks = publicSchema.table("blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockerId: uuid("blocker_id").notNull(),
  blockedId: uuid("blocked_id").notNull(),
  // Phone + device hash of blocked user — persists across account deletion/re-creation
  blockedPhoneHash: text("blocked_phone_hash"),
  blockedDeviceHash: text("blocked_device_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
