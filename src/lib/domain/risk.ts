import type {
  FlaggedAccount,
  FlagReason,
  ModerationAction,
} from "./types";

export type RiskLevel = "low" | "medium" | "high";

/** Thresholds are provisional until real detection data exists (Stage 3). */
export const RISK_THRESHOLDS = { medium: 40, high: 70 } as const;

export function riskLevel(score: number): RiskLevel {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new RangeError(`Risk score must be between 0 and 100, got ${score}`);
  }
  if (score >= RISK_THRESHOLDS.high) return "high";
  if (score >= RISK_THRESHOLDS.medium) return "medium";
  return "low";
}

export const FLAG_REASON_LABELS: Record<FlagReason, string> = {
  repeated_message: "Repeated messages",
  link_spam: "Link spam",
  new_account: "Very new account",
  message_burst: "Message burst",
  lookalike_name: "Look-alike username",
  twitch_suspicious_user: "Flagged by Twitch",
};

export interface DashboardSummary {
  flaggedTotal: number;
  pendingReview: number;
  highRisk: number;
  actionsTaken: number;
}

/** Derives headline numbers from records rather than storing them separately,
 * so the cards can never disagree with the underlying lists. */
export function summarise(
  accounts: readonly FlaggedAccount[],
  actions: readonly ModerationAction[],
): DashboardSummary {
  return {
    flaggedTotal: accounts.length,
    pendingReview: accounts.filter((a) => a.status === "pending_review").length,
    highRisk: accounts.filter((a) => riskLevel(a.riskScore) === "high").length,
    actionsTaken: actions.filter(
      (a) => a.type === "ban" || a.type === "timeout",
    ).length,
  };
}
