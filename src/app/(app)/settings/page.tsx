import type { Metadata } from "next";
import { getDetectionSettings } from "@/lib/data";
import { formatDuration } from "@/lib/format";
import { Card, Notice, PageHeader } from "@/components/ui/Card";
import type { ModerationMode, Sensitivity } from "@/lib/domain/types";

export const metadata: Metadata = { title: "Settings" };

const MODES: { value: ModerationMode; label: string; hint: string }[] = [
  {
    value: "manual_approval",
    label: "Manual approval (recommended)",
    hint: "Twitch Shield flags accounts and you decide what happens.",
  },
  {
    value: "automatic",
    label: "Automatic",
    hint: "Twitch Shield acts on high-risk accounts by itself, using the rules below.",
  },
];

const SENSITIVITIES: { value: Sensitivity; label: string; hint: string }[] = [
  { value: "relaxed", label: "Relaxed", hint: "Fewer flags, may miss some bots." },
  { value: "balanced", label: "Balanced", hint: "A sensible middle ground." },
  { value: "strict", label: "Strict", hint: "More flags, more false alarms." },
];

export default async function SettingsPage() {
  const settings = await getDetectionSettings();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Choose how sensitive detection is and what Twitch Shield is allowed to do on its own."
      />
      <div className="mb-6">
        <Notice>
          These are the safe defaults. Settings are saved per channel, so you
          can change them once you have connected Twitch.
        </Notice>
      </div>

      {/* Disabled until Stage 2 adds accounts and storage: a form that appears
          to save but doesn't would mislead users. */}
      <form aria-describedby="settings-locked">
        <p id="settings-locked" className="sr-only">
          Settings cannot be changed until you connect Twitch.
        </p>
        <fieldset disabled className="space-y-4">
          <Card title="Moderation mode">
            <div className="space-y-3">
              {MODES.map((m) => (
                <label key={m.value} className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="mode"
                    value={m.value}
                    defaultChecked={settings.mode === m.value}
                    className="mt-1 accent-accent-strong"
                  />
                  <span>
                    <span className="font-medium">{m.label}</span>
                    <span className="block text-sm text-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Detection sensitivity">
            <div className="grid gap-3 sm:grid-cols-3">
              {SENSITIVITIES.map((s) => (
                <label
                  key={s.value}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <input
                    type="radio"
                    name="sensitivity"
                    value={s.value}
                    defaultChecked={settings.sensitivity === s.value}
                    className="mt-1 accent-accent-strong"
                  />
                  <span>
                    <span className="font-medium">{s.label}</span>
                    <span className="block text-sm text-muted">{s.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Automatic actions">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoTimeout"
                  defaultChecked={settings.autoTimeoutEnabled}
                  className="accent-accent-strong"
                />
                <span>
                  Automatically time out high-risk accounts for{" "}
                  {formatDuration(settings.timeoutSeconds)}
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoBan"
                  defaultChecked={settings.autoBanEnabled}
                  className="accent-accent-strong"
                />
                <span>Automatically ban high-risk accounts</span>
              </label>
            </div>
          </Card>

          <Card title="Trusted accounts (allowlist)">
            <label htmlFor="allowlist" className="text-sm text-muted">
              Twitch usernames that are never flagged, one per line.
            </label>
            <textarea
              id="allowlist"
              name="allowlist"
              rows={3}
              defaultValue={settings.allowlist.join("\n")}
              placeholder="e.g. your_mod_bot"
              className="mt-2 w-full rounded-lg border border-border bg-bg p-3 text-sm placeholder:text-muted"
            />
          </Card>

          <button
            type="submit"
            className="rounded-lg bg-accent-strong px-4 py-2 font-medium text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save settings
          </button>
        </fieldset>
      </form>
    </>
  );
}
