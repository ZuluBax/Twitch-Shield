import type { Metadata } from "next";
import { getFlaggedAccounts } from "@/lib/data";
import { RISK_THRESHOLDS } from "@/lib/domain/risk";
import { Card, Notice, PageHeader } from "@/components/ui/Card";
import { SuspiciousTable } from "@/components/dashboard/SuspiciousTable";

export const metadata: Metadata = { title: "Suspicious accounts" };

export default async function SuspiciousPage() {
  const accounts = await getFlaggedAccounts();
  return (
    <>
      <PageHeader
        title="Suspicious accounts"
        description="Accounts whose chat behaviour looks automated or spammy. Being listed here is not proof of wrongdoing. Review each one before acting."
      />
      <div className="mb-4">
        <Notice>
          Risk scores run from 0 to 100. {RISK_THRESHOLDS.high} or more is high
          risk and {RISK_THRESHOLDS.medium}–{RISK_THRESHOLDS.high - 1} is medium.
          Twitch Shield only flags accounts. It will not ban anyone unless you
          turn on automatic moderation.
        </Notice>
      </div>
      <Card title="All flagged accounts" source={accounts.source}>
        <SuspiciousTable accounts={accounts.data} caption="All flagged accounts" />
      </Card>
    </>
  );
}
