import type { ConnectionStatus } from "@/lib/domain/types";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

const COPY: Record<
  ConnectionStatus["state"],
  { label: string; detail: string; tone: string; icon: "check" | "alert" | "info" }
> = {
  connected: {
    label: "Connected",
    detail: "Twitch Shield is watching your chat.",
    tone: "text-good",
    icon: "check",
  },
  token_expired: {
    label: "Reconnect needed",
    detail: "Your Twitch login expired. Reconnect to resume protection.",
    tone: "text-warning",
    icon: "alert",
  },
  not_connected: {
    label: "Not connected",
    detail:
      "Twitch login is coming in the next stage. Until then, this dashboard shows demo data.",
    tone: "text-muted",
    icon: "info",
  },
};

export function ConnectionStatusCard({ status }: { status: ConnectionStatus }) {
  const copy = COPY[status.state];
  return (
    <Card title="Twitch connection">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 ${copy.tone}`}>
          <Icon name={copy.icon} />
        </span>
        <div>
          <p className={`font-semibold ${copy.tone}`}>
            <span className="sr-only">Status: </span>
            {copy.label}
          </p>
          <p className="mt-1 text-sm text-muted">{copy.detail}</p>
          {status.channel && (
            <p className="mt-2 text-sm">Channel: {status.channel.displayName}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
