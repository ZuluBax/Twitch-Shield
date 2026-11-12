import type { DataSource, ReviewStatus } from "@/lib/domain/types";
import { riskLevel, type RiskLevel } from "@/lib/domain/risk";

/** Shown wherever data is not real, so demo numbers are never mistaken for live ones. */
export function SourceBadge({ source }: { source: DataSource }) {
  if (source === "live") return null;
  return (
    <span
      className="inline-flex items-center rounded-full border border-warning/50 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning"
      title="Example data for demonstration. Connect Twitch to see your channel."
    >
      Demo data
    </span>
  );
}

const RISK_STYLES: Record<RiskLevel, string> = {
  high: "border-critical/50 bg-critical/10 text-critical",
  medium: "border-warning/50 bg-warning/10 text-warning",
  low: "border-border bg-surface-2 text-muted",
};

const RISK_LABELS: Record<RiskLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function RiskBadge({ score }: { score: number }) {
  const level = riskLevel(score);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${RISK_STYLES[level]}`}
    >
      {RISK_LABELS[level]} · {score}
      <span className="sr-only"> out of 100 risk</span>
    </span>
  );
}

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending_review: "Needs review",
  dismissed: "Dismissed",
  actioned: "Actioned",
};

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending_review: "text-info",
  dismissed: "text-muted",
  actioned: "text-good",
};

export function ReviewStatusLabel({ status }: { status: ReviewStatus }) {
  return (
    <span className={`text-sm font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
