import type { Metadata } from "next";
import { getModerationActions } from "@/lib/data";
import { Card, PageHeader } from "@/components/ui/Card";
import { ActivityList } from "@/components/dashboard/ActivityList";

export const metadata: Metadata = { title: "Moderation activity" };

export default async function ActivityPage() {
  const actions = await getModerationActions();
  return (
    <>
      <PageHeader
        title="Moderation activity"
        description="Every flag, ban, timeout and dismissal, newest first. This is your audit trail."
      />
      <Card title="Activity log" source={actions.source}>
        <ActivityList actions={actions.data} />
      </Card>
    </>
  );
}
