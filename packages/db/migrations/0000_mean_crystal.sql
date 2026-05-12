CREATE SCHEMA "behavioral";
--> statement-breakpoint
CREATE SCHEMA "identity";
--> statement-breakpoint
CREATE SCHEMA "public_nexus";
--> statement-breakpoint
CREATE TYPE "public"."kyc_status" AS ENUM('none', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."badge_tier" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."match_intent" AS ENUM('project', 'study', 'cofounder', 'general', 'roommate');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('pending_icebreaker', 'icebreaker_in_progress', 'icebreaker_completed', 'revealed', 'expired', 'unmatched');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('coding_python', 'coding_js', 'coding_cpp', 'coding_java', 'design', 'writing', 'math_dsa', 'public_speaking');--> statement-breakpoint
CREATE TABLE "behavioral"."embedding_vectors" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"vector" jsonb NOT NULL,
	"model_version" text DEFAULT 'all-MiniLM-L6-v2' NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavioral"."ghost_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ghoster_id" uuid NOT NULL,
	"match_id" uuid NOT NULL,
	"ghost_type" text NOT NULL,
	"score_deduction" real NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavioral"."match_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"event" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavioral"."moderation_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"reason" text NOT NULL,
	"score_deduction" real,
	"duration_days" integer,
	"performed_by" uuid,
	"is_automated" boolean DEFAULT false NOT NULL,
	"related_report_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavioral"."reliability_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"previous_score" real NOT NULL,
	"new_score" real NOT NULL,
	"delta" real NOT NULL,
	"reason" text NOT NULL,
	"trigger_event" text NOT NULL,
	"triggered_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavioral"."response_time_stats" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"average_response_ms" integer,
	"total_messages_analysed" integer DEFAULT 0 NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."otp_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"target" text NOT NULL,
	"channel" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."reveal_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"requester_user_id" uuid NOT NULL,
	"revealed_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity"."sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"device_hash" text,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "identity"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"real_name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone" text NOT NULL,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"college_domain" text NOT NULL,
	"college_id" uuid NOT NULL,
	"photo_url" text,
	"kyc_status" "kyc_status" DEFAULT 'none' NOT NULL,
	"kyc_doc_url" text,
	"device_hash" text,
	"phone_hash" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_suspended" boolean DEFAULT false NOT NULL,
	"suspended_reason" text,
	"last_verified_at" timestamp with time zone,
	"reverify_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "skill_category" NOT NULL,
	"tier" "badge_tier" NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"revoked_reason" text
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"blocked_phone_hash" text,
	"blocked_device_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text,
	"image_url" text,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"flag_reason" text,
	"moderation_score" real,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."colleges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"tier" text NOT NULL,
	"student_count" integer,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "colleges_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."endorsements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endorser_id" uuid NOT NULL,
	"endorsee_id" uuid NOT NULL,
	"category" "skill_category" NOT NULL,
	"weight" real NOT NULL,
	"match_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"liker_id" uuid NOT NULL,
	"liked_id" uuid NOT NULL,
	"intent" "match_intent" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" uuid NOT NULL,
	"user2_id" uuid NOT NULL,
	"intent" "match_intent" NOT NULL,
	"status" "match_status" DEFAULT 'pending_icebreaker' NOT NULL,
	"icebreaker_prompt" text,
	"user1_answer" text,
	"user2_answer" text,
	"is_revealed" boolean DEFAULT false NOT NULL,
	"revealed_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"college_id" uuid NOT NULL,
	"pseudonym" text NOT NULL,
	"branch" text NOT NULL,
	"batch_year" integer NOT NULL,
	"interests" text[] DEFAULT '{}' NOT NULL,
	"project_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"reliability_score" real DEFAULT 70 NOT NULL,
	"reliability_tag" text DEFAULT 'Reliable' NOT NULL,
	"is_shadow_banned" boolean DEFAULT false NOT NULL,
	"is_ready_for_feed" boolean DEFAULT false NOT NULL,
	"is_cofounder_mode_enabled" boolean DEFAULT false NOT NULL,
	"cofounder_profile" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_pseudonym_unique" UNIQUE("pseudonym")
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid NOT NULL,
	"reported_user_id" uuid NOT NULL,
	"category" text NOT NULL,
	"details" text,
	"status" text DEFAULT 'open' NOT NULL,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_nexus"."skill_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "skill_category" NOT NULL,
	"tier" "badge_tier" NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"submission_data" jsonb,
	"score" real,
	"judge_verdict" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"graded_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "public_nexus"."chat_messages" ADD CONSTRAINT "chat_messages_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public_nexus"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_nexus"."profiles" ADD CONSTRAINT "profiles_college_id_colleges_id_fk" FOREIGN KEY ("college_id") REFERENCES "public_nexus"."colleges"("id") ON DELETE no action ON UPDATE no action;