/**
 * DEMONSTRATION DATA ONLY.
 *
 * Every username is prefixed "demo_" so it can't be mistaken for (or accuse) a
 * real Twitch account. Timestamps are fixed rather than computed from "now" so
 * pages render the same on the server and in the browser and so tests are
 * deterministic.
 */
import type {
  DailyCount,
  FlaggedAccount,
  ModerationAction,
} from "@/lib/domain/types";

export const DEMO_FLAGGED_ACCOUNTS: readonly FlaggedAccount[] = [
  {
    id: "fa_01",
    login: "demo_freefollows_4821",
    displayName: "demo_FreeFollows_4821",
    riskScore: 94,
    reasons: ["link_spam", "new_account", "repeated_message"],
    messageCount: 12,
    firstSeenAt: "2026-11-10T19:41:00Z",
    lastSeenAt: "2026-11-10T19:44:00Z",
    status: "pending_review",
  },
  {
    id: "fa_02",
    login: "demo_viewerboost_x",
    displayName: "demo_ViewerBoost_X",
    riskScore: 88,
    reasons: ["link_spam", "message_burst"],
    messageCount: 7,
    firstSeenAt: "2026-11-10T18:02:00Z",
    lastSeenAt: "2026-11-10T18:03:00Z",
    status: "actioned",
  },
  {
    id: "fa_03",
    login: "demo_streamhelper_01",
    displayName: "demo_StreamHelper_01",
    riskScore: 76,
    reasons: ["twitch_suspicious_user", "lookalike_name"],
    messageCount: 3,
    firstSeenAt: "2026-11-10T16:20:00Z",
    lastSeenAt: "2026-11-10T16:31:00Z",
    status: "pending_review",
  },
  {
    id: "fa_04",
    login: "demo_hypetrain_bot",
    displayName: "demo_HypeTrain_Bot",
    riskScore: 58,
    reasons: ["repeated_message"],
    messageCount: 21,
    firstSeenAt: "2026-11-09T21:10:00Z",
    lastSeenAt: "2026-11-09T22:47:00Z",
    status: "pending_review",
  },
  {
    id: "fa_05",
    login: "demo_new_viewer_77",
    displayName: "demo_new_viewer_77",
    riskScore: 41,
    reasons: ["new_account"],
    messageCount: 2,
    firstSeenAt: "2026-11-09T20:05:00Z",
    lastSeenAt: "2026-11-09T20:06:00Z",
    status: "dismissed",
  },
  {
    id: "fa_06",
    login: "demo_capslock_carl",
    displayName: "demo_CapsLock_Carl",
    riskScore: 27,
    reasons: ["message_burst"],
    messageCount: 9,
    firstSeenAt: "2026-11-08T19:30:00Z",
    lastSeenAt: "2026-11-08T19:33:00Z",
    status: "dismissed",
  },
];

export const DEMO_MODERATION_ACTIONS: readonly ModerationAction[] = [
  {
    id: "ma_01",
    type: "flagged",
    targetLogin: "demo_freefollows_4821",
    actor: "system",
    reason: "Posted the same link 12 times in 3 minutes",
    createdAt: "2026-11-10T19:44:00Z",
  },
  {
    id: "ma_02",
    type: "ban",
    targetLogin: "demo_viewerboost_x",
    actor: "demo_mod_alex",
    reason: "Selling viewers in chat",
    createdAt: "2026-11-10T18:05:00Z",
  },
  {
    id: "ma_03",
    type: "flagged",
    targetLogin: "demo_streamhelper_01",
    actor: "system",
    reason: "Twitch marked this account as a possible ban evader",
    createdAt: "2026-11-10T16:31:00Z",
  },
  {
    id: "ma_04",
    type: "timeout",
    targetLogin: "demo_hypetrain_bot",
    actor: "demo_mod_sam",
    reason: "Repeated copypasta",
    durationSeconds: 600,
    createdAt: "2026-11-09T22:48:00Z",
  },
  {
    id: "ma_05",
    type: "dismissed",
    targetLogin: "demo_new_viewer_77",
    actor: "demo_mod_sam",
    reason: "Genuine new viewer",
    createdAt: "2026-11-09T20:15:00Z",
  },
  {
    id: "ma_06",
    type: "dismissed",
    targetLogin: "demo_capslock_carl",
    actor: "demo_mod_alex",
    reason: "Excited regular, not a bot",
    createdAt: "2026-11-08T19:40:00Z",
  },
];

export const DEMO_DAILY_FLAGS: readonly DailyCount[] = [
  { date: "2026-10-28", count: 3 },
  { date: "2026-10-29", count: 5 },
  { date: "2026-10-30", count: 2 },
  { date: "2026-10-31", count: 8 },
  { date: "2026-11-01", count: 4 },
  { date: "2026-11-02", count: 1 },
  { date: "2026-11-03", count: 6 },
  { date: "2026-11-04", count: 7 },
  { date: "2026-11-05", count: 3 },
  { date: "2026-11-06", count: 11 },
  { date: "2026-11-07", count: 5 },
  { date: "2026-11-08", count: 4 },
  { date: "2026-11-09", count: 9 },
  { date: "2026-11-10", count: 6 },
];
