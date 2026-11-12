import type { Metadata } from "next";
import { getConnectionStatus } from "@/lib/data";
import { Card, PageHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const status = await getConnectionStatus();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your Twitch account and what Twitch Shield can access."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Twitch account">
          {status.channel ? (
            <p>Signed in as {status.channel.displayName}</p>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
                  <Icon name="profile" className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-medium">No account connected</p>
                  <p className="text-sm text-muted">
                    Connect Twitch to protect your channel.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled
                aria-describedby="connect-hint"
                className="rounded-lg bg-accent-strong px-4 py-2 font-medium text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                Connect with Twitch
              </button>
              <p id="connect-hint" className="text-sm text-muted">
                Not available yet. Twitch login arrives in the next update.
              </p>
            </div>
          )}
        </Card>

        <Card title="What we will ask Twitch for">
          <p className="mb-3 text-sm text-muted">
            Twitch Shield only asks for the access each feature needs, and asks
            when you turn that feature on.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Sign in:</span> your public profile
              (name and picture). We do not ask for your email address.
            </li>
            <li>
              <span className="font-medium">Chat monitoring:</span> read chat
              messages in your channel.
            </li>
            <li>
              <span className="font-medium">Moderation:</span> ban, time out and
              delete messages, only if you turn this on.
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted">
            You can disconnect at any time. Disconnecting withdraws our access
            to your Twitch account straight away.
          </p>
        </Card>
      </div>
    </>
  );
}
