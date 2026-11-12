/**
 * Data access layer. Pages call only these functions; they never import demo
 * data directly. In Stage 2/3 each function switches to the database for a
 * connected channel and returns source: "live" — no page changes required.
 *
 * Functions are async now so that switch does not change their signatures.
 */
import type {
  ConnectionStatus,
  DailyCount,
  DetectionSettings,
  FlaggedAccount,
  ModerationAction,
  Sourced,
} from "@/lib/domain/types";
import { DEFAULT_SETTINGS } from "@/lib/domain/settings";
import {
  DEMO_DAILY_FLAGS,
  DEMO_FLAGGED_ACCOUNTS,
  DEMO_MODERATION_ACTIONS,
} from "./demo";

/**
 * Real status, not demo: Twitch login does not exist until Stage 2, so no
 * channel can be connected yet.
 */
export async function getConnectionStatus(): Promise<ConnectionStatus> {
  return { state: "not_connected" };
}

export async function getFlaggedAccounts(): Promise<Sourced<FlaggedAccount[]>> {
  const data = [...DEMO_FLAGGED_ACCOUNTS].sort(
    (a, b) => b.riskScore - a.riskScore,
  );
  return { source: "demo", data };
}

export async function getModerationActions(): Promise<
  Sourced<ModerationAction[]>
> {
  const data = [...DEMO_MODERATION_ACTIONS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return { source: "demo", data };
}

export async function getDailyFlagCounts(): Promise<Sourced<DailyCount[]>> {
  return { source: "demo", data: [...DEMO_DAILY_FLAGS] };
}

/** Defaults only until settings are stored per channel (Stage 2). */
export async function getDetectionSettings(): Promise<DetectionSettings> {
  return { ...DEFAULT_SETTINGS, allowlist: [...DEFAULT_SETTINGS.allowlist] };
}
