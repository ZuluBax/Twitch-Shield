@AGENTS.md

# Twitch Shield: project instructions

The global standards in `~/.claude/CLAUDE.md` apply. This file adds project-specific rules.

## Read first
- `PROJECT_STATUS.md`: which stage we're on and what's next.
- `TECHNICAL_ARCHITECTURE.md`: stack, Twitch scopes and limitations, security design.
- Next.js 16 differs from older versions. Read `node_modules/next/dist/docs/` before using a Next API (see AGENTS.md). Cache Components is enabled.

## Rules
- **Pages never import demo data directly.** All data goes through `src/lib/data/index.ts`, which returns `{ source, data }`. Anything with `source: "demo"` must show a `SourceBadge`.
- **Never claim an integration works when it's mocked.** Connection status must reflect reality.
- **Demo usernames start with `demo_`** (enforced by a test) so they can't be mistaken for real accounts.
- **Automated moderation is off by default** and needs an explicit opt-in and an audit log entry for every action.
- **Request the minimum Twitch scopes**, per feature, when the feature is enabled. Update the scope table in TECHNICAL_ARCHITECTURE.md whenever scopes change.
- **Tokens and secrets stay server-side.** Never put them in client components, logs or `NEXT_PUBLIC_*` variables.
- Every query is scoped to the signed-in user's channels.
- Show timestamps in UTC via `src/lib/format.ts` (avoids hydration mismatches).
- Colours come from the tokens in `src/app/globals.css`, never hard-coded hex in components.
- Compliance: GOV.UK Service Standard and Technology Code of Practice. Accessibility is WCAG 2.2 AA (axe tests in `e2e/`).

## Before saying work is done
Run `npm run check` (typecheck, lint, unit tests, e2e). Update `PROJECT_STATUS.md` when a stage completes.
