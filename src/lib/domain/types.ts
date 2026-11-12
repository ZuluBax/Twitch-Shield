/**
 * Core domain types. These are deliberately independent of Twitch's API shapes
 * and of the database, so the UI does not change when demo data is replaced by
 * real data in Stages 2–3.
 */

/** Where a piece of data came from. The UI must label anything that is "demo". */
export type DataSource = "demo" | "live";

export interface Sourced<T> {
  source: DataSource;
  data: T;
}

export type ConnectionState = "not_connected" | "connected" | "token_expired";

export interface ConnectionStatus {
  state: ConnectionState;
  /** Present only when connected. */
  channel?: { login: string; displayName: string; profileImageUrl: string };
}

/** Why an account was flagged. Each signal is evidence, never proof. */
export type FlagReason =
  | "repeated_message"
  | "link_spam"
  | "new_account"
  | "message_burst"
  | "lookalike_name"
  | "twitch_suspicious_user";

export type ReviewStatus = "pending_review" | "dismissed" | "actioned";

export interface FlaggedAccount {
  id: string;
  login: string;
  displayName: string;
  /** 0–100. Higher means more likely to be unwanted automation or spam. */
  riskScore: number;
  reasons: FlagReason[];
  messageCount: number;
  firstSeenAt: string; // ISO 8601, UTC
  lastSeenAt: string; // ISO 8601, UTC
  status: ReviewStatus;
}

export type ModerationActionType =
  | "flagged"
  | "timeout"
  | "ban"
  | "unban"
  | "dismissed";

export interface ModerationAction {
  id: string;
  type: ModerationActionType;
  targetLogin: string;
  /** "system" for automated actions; otherwise the moderator's login. */
  actor: string;
  reason: string;
  /** Seconds; only for timeouts. */
  durationSeconds?: number;
  createdAt: string; // ISO 8601, UTC
}

export interface DailyCount {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

export type ModerationMode = "manual_approval" | "automatic";
export type Sensitivity = "relaxed" | "balanced" | "strict";

export interface DetectionSettings {
  mode: ModerationMode;
  sensitivity: Sensitivity;
  autoTimeoutEnabled: boolean;
  autoBanEnabled: boolean;
  /** Default timeout length in seconds. Twitch allows 1 to 1,209,600 (14 days). */
  timeoutSeconds: number;
  allowlist: string[];
}
