import { describe, expect, it } from "vitest";
import { riskLevel, summarise } from "./risk";
import type { FlaggedAccount, ModerationAction } from "./types";

describe("riskLevel", () => {
  it.each([
    [0, "low"],
    [39, "low"],
    [40, "medium"],
    [69, "medium"],
    [70, "high"],
    [100, "high"],
  ] as const)("score %d is %s", (score, expected) => {
    expect(riskLevel(score)).toBe(expected);
  });

  it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects out-of-range score %d",
    (score) => {
      expect(() => riskLevel(score)).toThrow(RangeError);
    },
  );
});

const account = (
  id: string,
  riskScore: number,
  status: FlaggedAccount["status"],
): FlaggedAccount => ({
  id,
  login: id,
  displayName: id,
  riskScore,
  reasons: ["repeated_message"],
  messageCount: 1,
  firstSeenAt: "2026-01-01T00:00:00Z",
  lastSeenAt: "2026-01-01T00:00:00Z",
  status,
});

const action = (id: string, type: ModerationAction["type"]): ModerationAction => ({
  id,
  type,
  targetLogin: "x",
  actor: "system",
  reason: "r",
  createdAt: "2026-01-01T00:00:00Z",
});

describe("summarise", () => {
  it("counts each category from the records", () => {
    const summary = summarise(
      [
        account("a", 95, "pending_review"),
        account("b", 70, "actioned"),
        account("c", 50, "pending_review"),
        account("d", 10, "dismissed"),
      ],
      [
        action("1", "ban"),
        action("2", "timeout"),
        action("3", "flagged"),
        action("4", "dismissed"),
        action("5", "unban"),
      ],
    );
    expect(summary).toEqual({
      flaggedTotal: 4,
      pendingReview: 2,
      highRisk: 2,
      actionsTaken: 2,
    });
  });

  it("returns zeros for empty input", () => {
    expect(summarise([], [])).toEqual({
      flaggedTotal: 0,
      pendingReview: 0,
      highRisk: 0,
      actionsTaken: 0,
    });
  });
});
