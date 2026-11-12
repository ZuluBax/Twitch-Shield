import type { Metadata } from "next";
import {
  getConnectionStatus,
  getDailyFlagCounts,
  getFlaggedAccounts,
  getModerationActions,
} from "@/lib/data";
import { summarise } from "@/lib/domain/risk";
import { Card, Notice, PageHeader, StatCard } from "@/components/ui/Card";
import { SourceBadge } from "@/components/ui/Badges";
import { ConnectionStatusCard } from "@/components/dashboard/ConnectionStatusCard";
import { FlagsChart } from "@/components/dashboard/FlagsChart";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { SuspiciousTable } from "@/components/dashboard/SuspiciousTable";
import Link from "next/link";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const [status, accounts, actions, daily] = await Promise.all([
    getConnectionStatus(),
    getFlaggedAccounts(),
    getModerationActions(),
    getDailyFlagCounts(),
  ]);
  const summary = summarise(accounts.data, actions.data);
  const anyDemo = [accounts, actions, daily].some((d) => d.source === "demo");

  return (
    <>
      <PageHeader
        title="Overview"
        description="A summary of suspicious activity in your chat and what has been done about it."
      />

      {anyDemo && (
        <div className="mb-6">
          <Notice tone="warning">
            <strong>You are looking at demo data.</strong> The accounts and
            numbers below are examples, not your channel. Real data appears
            once you connect Twitch.
          </Notice>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <ConnectionStatusCard status={status} />
        <section
          aria-labelledby="stats-heading"
          className="lg:col-span-2"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 id="stats-heading" className="text-base font-semibold">
              At a glance
            </h2>
            <SourceBadge source={accounts.source} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Flagged" value={summary.flaggedTotal} hint="Accounts flagged" />
            <StatCard label="Needs review" value={summary.pendingReview} hint="Waiting for you" />
            <StatCard label="High risk" value={summary.highRisk} hint="Score 70 or more" />
            <StatCard label="Actions" value={summary.actionsTaken} hint="Bans and timeouts" />
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card title="Flagged accounts per day" source={daily.source} className="lg:col-span-3">
          <FlagsChart data={daily.data} />
        </Card>
        <Card
          title="Recent moderation activity"
          source={actions.source}
          className="lg:col-span-2"
          action={
            <Link href="/activity" className="text-sm text-accent hover:underline">
              View all
            </Link>
          }
        >
          <ActivityList actions={actions.data.slice(0, 4)} />
        </Card>
      </div>

      <Card
        title="Highest-risk accounts"
        source={accounts.source}
        className="mt-4"
        action={
          <Link href="/suspicious" className="text-sm text-accent hover:underline">
            View all
          </Link>
        }
      >
        <SuspiciousTable
          accounts={accounts.data.slice(0, 3)}
          caption="Highest-risk accounts"
        />
      </Card>
    </>
  );
}
