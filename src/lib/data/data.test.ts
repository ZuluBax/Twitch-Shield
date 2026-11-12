import { describe, expect, it } from "vitest";
import {
  getConnectionStatus,
  getDailyFlagCounts,
  getDetectionSettings,
  getFlaggedAccounts,
  getModerationActions,
} from "./index";
import { DEFAULT_SETTINGS } from "@/lib/domain/settings";

describe("data layer (Stage 1)", () => {
  it("labels every demo dataset as demo", async () => {
    const results = await Promise.all([
      getFlaggedAccounts(),
      getModerationActions(),
      getDailyFlagCounts(),
    ]);
    for (const r of results) expect(r.source).toBe("demo");
  });

  it("reports not connected, because Twitch login does not exist yet", async () => {
    expect(await getConnectionStatus()).toEqual({ state: "not_connected" });
  });

  it("uses only obviously fake demo usernames", async () => {
    const accounts = (await getFlaggedAccounts()).data;
    const actions = (await getModerationActions()).data;
    const names = [
      ...accounts.map((a) => a.login),
      ...actions.map((a) => a.targetLogin),
      ...actions.filter((a) => a.actor !== "system").map((a) => a.actor),
    ];
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) expect(n.startsWith("demo_")).toBe(true);
  });

  it("returns flagged accounts sorted by risk, highest first, with valid scores", async () => {
    const { data } = await getFlaggedAccounts();
    const scores = data.map((a) => a.riskScore);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
    expect(new Set(data.map((a) => a.id)).size).toBe(data.length);
  });

  it("returns moderation actions newest first", async () => {
    const { data } = await getModerationActions();
    const times = data.map((a) => a.createdAt);
    expect(times).toEqual([...times].sort().reverse());
  });

  it("returns a copy of settings so callers cannot mutate the defaults", async () => {
    const settings = await getDetectionSettings();
    settings.allowlist.push("someone");
    settings.mode = "automatic";
    expect(DEFAULT_SETTINGS.allowlist).toEqual([]);
    expect(DEFAULT_SETTINGS.mode).toBe("manual_approval");
  });

  it("defaults to manual approval with no automated actions", async () => {
    const s = await getDetectionSettings();
    expect(s.mode).toBe("manual_approval");
    expect(s.autoBanEnabled).toBe(false);
    expect(s.autoTimeoutEnabled).toBe(false);
  });
});
