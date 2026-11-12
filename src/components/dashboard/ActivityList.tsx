import type { ModerationAction, ModerationActionType } from "@/lib/domain/types";
import { formatDateTime, formatDuration } from "@/lib/format";

const ACTION_LABELS: Record<ModerationActionType, string> = {
  flagged: "Flagged",
  timeout: "Timed out",
  ban: "Banned",
  unban: "Unbanned",
  dismissed: "Dismissed",
};

const ACTION_STYLES: Record<ModerationActionType, string> = {
  flagged: "text-info",
  timeout: "text-warning",
  ban: "text-critical",
  unban: "text-good",
  dismissed: "text-muted",
};

export function ActivityList({ actions }: { actions: readonly ModerationAction[] }) {
  if (actions.length === 0) {
    return <p className="text-sm text-muted">No moderation activity yet.</p>;
  }
  return (
    <ol className="divide-y divide-border">
      {actions.map((a) => (
        <li key={a.id} className="flex gap-3 py-3">
          <span className={`w-24 shrink-0 text-sm font-semibold ${ACTION_STYLES[a.type]}`}>
            {ACTION_LABELS[a.type]}
            {a.type === "timeout" && a.durationSeconds
              ? ` (${formatDuration(a.durationSeconds)})`
              : ""}
          </span>
          {/* Single text column: a third column squeezed usernames into
              one-letter-per-line wrapping on narrow cards. */}
          <span className="min-w-0 flex-1">
            <span className="block font-medium [overflow-wrap:anywhere]">
              {a.targetLogin}
            </span>
            <span className="block text-sm text-muted">{a.reason}</span>
            <span className="mt-1 block text-xs text-muted">
              {a.actor === "system" ? "Automatic" : `by ${a.actor}`} ·{" "}
              <time dateTime={a.createdAt}>{formatDateTime(a.createdAt)}</time>
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
