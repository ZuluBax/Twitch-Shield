import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { path: "/dashboard", heading: "Overview" },
  { path: "/suspicious", heading: "Suspicious accounts" },
  { path: "/activity", heading: "Moderation activity" },
  { path: "/settings", heading: "Settings" },
  { path: "/profile", heading: "Profile" },
];

test("root redirects to the dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
});

for (const { path, heading } of PAGES) {
  test.describe(path, () => {
    test("renders its heading and has no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });

    test("does not scroll sideways", async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("security headers are sent", async ({ request }) => {
  const res = await request.get("/dashboard");
  const h = res.headers();
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("dashboard clearly labels demo data and shows not-connected state", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("You are looking at demo data.")).toBeVisible();
  await expect(page.getByText("Demo data").first()).toBeVisible();
  await expect(page.getByText("Not connected")).toBeVisible();
});

test("settings are locked and default to manual approval", async ({ page }) => {
  await page.goto("/settings");
  const manual = page.getByRole("radio", { name: /Manual approval/ });
  await expect(manual).toBeChecked();
  await expect(manual).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: /ban high-risk/ })).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Save settings" })).toBeDisabled();
});

test("navigation marks the current page and moves between pages", async ({ page, isMobile }) => {
  await page.goto("/dashboard");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  const nav = page.getByRole("navigation", { name: "Main" }).filter({ visible: true });
  await expect(nav.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
  if (isMobile) {
    // Menu closes after navigating so content is not hidden behind it.
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  }
});

test("mobile menu closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only control");
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
});
