import { describe, expect, it } from "vitest";
import { formatDateTime, formatDuration, formatShortDate } from "./format";
import { isActivePath } from "./navigation";

describe("formatting", () => {
  it("formats timestamps in UTC regardless of machine timezone", () => {
    expect(formatDateTime("2026-11-10T23:30:00Z")).toBe("10 Nov, 23:30 UTC");
  });

  it("formats a calendar date without shifting the day", () => {
    expect(formatShortDate("2026-11-01")).toBe("1 Nov");
  });

  it.each([
    [30, "30s"],
    [600, "10m"],
    [7200, "2h"],
    [1_209_600, "14d"],
  ])("formats %d seconds as %s", (s, out) => {
    expect(formatDuration(s)).toBe(out);
  });
});

describe("isActivePath", () => {
  it("matches the page and its children only", () => {
    expect(isActivePath("/settings", "/settings")).toBe(true);
    expect(isActivePath("/settings/alerts", "/settings")).toBe(true);
    expect(isActivePath("/settingsx", "/settings")).toBe(false);
    expect(isActivePath("/dashboard", "/settings")).toBe(false);
  });
});
