# Project Status

_Last updated: 2026-11-11_

## Current stage: Stage 1 (Application foundation) is complete

## Milestones

| # | Stage | Status |
|---|---|---|
| 1 | Application foundation: dashboard, navigation, pages, demo data, tests | ✅ Done |
| 2 | Twitch login: OAuth, Postgres + Prisma, sessions, encrypted tokens, disconnect/revoke, settings saved per channel, full CSP | ⏭ Next |
| 3 | Chat monitoring: worker, EventSub, detection rules, flags in the dashboard (flag only, no actions) | Planned |
| 4 | Moderation: review queue, manual and automatic ban/timeout, allowlist, audit trail, rate-limit handling | Planned |
| 5 | Shared intelligence: **blocked** on a Twitch Developer Agreement review and a UK GDPR assessment (see TECHNICAL_ARCHITECTURE.md §5) | Design only |

## What works now (Stage 1)

- Five pages: Overview, Suspicious accounts, Moderation activity, Settings, Profile.
- Sidebar navigation on desktop and a menu button on mobile (closes with Escape or after choosing a page).
- All numbers and lists are **demo data**, labelled "Demo data" on screen.
- Connection status truthfully says "Not connected".
- Settings show the safe defaults (manual approval, nothing automatic) and are locked until Stage 2.
- Baseline security headers.

## Checks run on 2026-11-11

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm test`: 36 unit/component tests passed
- `npm run test:e2e`: 31 passed, 1 skipped (a mobile-only test, skipped on desktop). Covers both desktop and mobile layouts: page loads, axe WCAG 2.2 AA scans on every page, no sideways scrolling, navigation, mobile menu, security headers, demo labelling, locked settings.
- `npm run build`: passed

Automated accessibility scans don't replace a manual check with a screen reader. That hasn't been done yet.

## Known issues / TODO

- [ ] `npm audit` shows 7 moderate issues in the `minimatch` package that `typescript-eslint` depends on (used by `eslint-config-next`). Lint tooling only, never shipped to users. Re-check when `eslint-config-next` updates.
- [ ] Full nonce-based Content-Security-Policy (Stage 2).
- [ ] Choose a final product name: "Twitch" in the name likely conflicts with Twitch's brand guidelines.
- [ ] Read the current Twitch Developer Services Agreement in full before designing Stage 5 data sharing.
- [ ] Manual screen-reader pass (NVDA) before first public release.
- [ ] Initialise the GitHub remote and CI when ready.

## Next recommended action

Approve the Stage 2 plan. Before Stage 2 can be tested end to end, you will need to register an application at <https://dev.twitch.tv/console> to get a Client ID and Secret (free).
