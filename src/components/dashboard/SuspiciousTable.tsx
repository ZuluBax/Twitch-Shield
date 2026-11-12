import type { FlaggedAccount } from "@/lib/domain/types";
import { FLAG_REASON_LABELS } from "@/lib/domain/risk";
import { formatDateTime } from "@/lib/format";
import { RiskBadge, ReviewStatusLabel } from "@/components/ui/Badges";

export function SuspiciousTable({
  accounts,
  caption,
}: {
  accounts: readonly FlaggedAccount[];
  caption: string;
}) {
  if (accounts.length === 0) {
    return <p className="text-sm text-muted">No suspicious accounts detected.</p>;
  }
  return (
    // Scrolls inside its own box on narrow screens instead of the whole page.
    <div className="-mx-5 overflow-x-auto px-5" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-muted">
            <th scope="col" className="pb-2 font-medium">Account</th>
            <th scope="col" className="pb-2 font-medium">Risk</th>
            <th scope="col" className="pb-2 font-medium">Why it was flagged</th>
            <th scope="col" className="pb-2 font-medium">Last seen</th>
            <th scope="col" className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} className="border-t border-border align-top">
              <th scope="row" className="py-3 pr-3 font-medium break-all">
                {a.displayName}
                <span className="block text-xs font-normal text-muted">
                  {a.messageCount} messages
                </span>
              </th>
              <td className="py-3 pr-3">
                <RiskBadge score={a.riskScore} />
              </td>
              <td className="py-3 pr-3">
                <ul className="flex flex-wrap gap-1">
                  {a.reasons.map((r) => (
                    <li
                      key={r}
                      className="rounded-md bg-surface-2 px-2 py-0.5 text-xs"
                    >
                      {FLAG_REASON_LABELS[r]}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-3 pr-3 whitespace-nowrap text-muted">
                <time dateTime={a.lastSeenAt}>{formatDateTime(a.lastSeenAt)}</time>
              </td>
              <td className="py-3">
                <ReviewStatusLabel status={a.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
