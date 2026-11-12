import type { DetectionSettings } from "./types";

/** Twitch's documented timeout limits for the Ban User endpoint. */
export const TWITCH_TIMEOUT_MIN_SECONDS = 1;
export const TWITCH_TIMEOUT_MAX_SECONDS = 1_209_600;

/**
 * Safe defaults: nothing is automated. The product brief requires manual
 * approval until detection has been tested on real chat.
 */
export const DEFAULT_SETTINGS: DetectionSettings = Object.freeze({
  mode: "manual_approval",
  sensitivity: "balanced",
  autoTimeoutEnabled: false,
  autoBanEnabled: false,
  timeoutSeconds: 600,
  allowlist: [],
}) as DetectionSettings;
