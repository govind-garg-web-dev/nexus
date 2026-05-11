// ─── Enums ────────────────────────────────────────────────────────────────────

export type CollegeTier = "tier1" | "tier2" | "tier3";

export type SkillCategory = "coding_python" | "coding_js" | "coding_cpp" | "coding_java" | "design" | "writing" | "math_dsa" | "public_speaking";

export type BadgeTier = "beginner" | "intermediate" | "advanced";

export type MatchIntent = "project" | "study" | "cofounder" | "general" | "roommate";

export type MatchStatus =
  | "pending_icebreaker"
  | "icebreaker_in_progress"
  | "icebreaker_completed"
  | "revealed"
  | "expired"
  | "unmatched";

export type ReportCategory =
  | "harassment"
  | "doxxing"
  | "impersonation"
  | "sexual_content"
  | "skill_fraud"
  | "ghosting"
  | "scam";

export type ViolationType =
  | "ghost_after_match"
  | "event_noshow"
  | "mild_rudeness"
  | "harassment"
  | "doxxing"
  | "skill_fraud"
  | "catfishing"
  | "sexual_harassment";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface College {
  id: string;
  name: string;
  domain: string;
  city: string;
  tier: CollegeTier;
  studentCount: number;
  isActive: boolean;
}

export interface PublicProfile {
  userId: string;
  pseudonym: string;
  collegeId: string;
  branch: string;
  batchYear: number;
  interests: string[];
  projectLinks: string[];
  reliabilityScore: number;
  reliabilityTag: "Reliable" | "Mixed" | "Avoid";
  badges: Badge[];
  createdAt: Date;
}

export interface Badge {
  id: string;
  userId: string;
  category: SkillCategory;
  tier: BadgeTier;
  issuedAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  intent: MatchIntent;
  status: MatchStatus;
  icebreakerPrompt: string | null;
  user1Answer: string | null;
  user2Answer: string | null;
  createdAt: Date;
  revealedAt: Date | null;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  imageUrl: string | null;
  isFlagged: boolean;
  createdAt: Date;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthSession {
  userId: string;
  email: string;
  collegeId: string;
  sessionToken: string;
  expiresAt: Date;
}

export interface SignupPayload {
  email: string;
  phone: string;
  emailOtp: string;
  smsOtp: string;
}

export interface ProfileSetupPayload {
  pseudonym: string;
  branch: string;
  batchYear: number;
  interests: string[];
  projectLinks: string[];
}
