# Twitch Shield — Technical Architecture

_Last updated: 2026-11-11 (end of Stage 1)._

## 1. Stack and why

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript (strict) | One language front to back; type errors caught before runtime. |
| Web app | Next.js 16 (App Router), React 19 | Pages and server-side API routes in one project. Secrets stay on the server. |
| Styling | Tailwind CSS 4 + design tokens in `src/app/globals.css` | No component library to maintain; tokens keep colours consistent and contrast-checked. |
| Database (Stage 2+) | PostgreSQL + Prisma | Relational data (channels, accounts, actions, evidence) with constraints and migrations. Open source, so no vendor lock-in. |
| Chat ingestion (Stage 3+) | Separate long-running Node worker | Twitch EventSub needs a persistent connection or webhook receiver. Serverless page hosting can't hold one open. |
| Unit tests | Vitest + Testing Library | Fast; same config style as the app. |
| Browser tests | Playwright + axe-core | Real-browser checks on desktop and mobile, plus automated WCAG 2.2 AA scans. |

No paid services are used. Local development needs Node 24 and, from Stage 2, Docker (for Postgres).

## 2. System shape (target, Stage 3+)

```
 Twitch ──OAuth──► Web app (Next.js) ◄──── Streamer's browser
   │                  │  reads/writes
   │ EventSub         ▼
   └────────► Worker ──► PostgreSQL ◄── audit log, flags, settings
               │
               └─► Helix API (ban / timeout / delete) only when allowed by settings
```

- **Web app**: dashboard, OAuth login, settings, review queue. Never sends tokens to the browser.
- **Worker**: receives chat events, runs detection, writes flags. Takes automatic actions only if the channel enabled them. Every action is audit-logged.
- **Database**: the single source of truth. Each row carries a `channel_id`, and every query is scoped to the signed-in user's channels, so one streamer can't read another's data.

## 2a. Who can access a channel (product decision, 2026-11-11)

Streamers sign in and own their channel. A streamer can then give moderators access. Moderators also sign in with Twitch, but they only see a channel once its streamer has granted them access. Being a moderator on Twitch does not grant access automatically.

| Role | Can do |
|---|---|
| Owner (the streamer) | Everything: settings, automation, granting and removing moderator access and permissions, disconnecting the channel. |
| Moderator (granted) | Always: view the dashboard and review flagged accounts. Plus any of the per-moderator permissions below that the owner switches on. Never: manage access, grant permissions, disconnect the channel. |

Per-moderator permissions, each off by default and switched on by the owner for an individual moderator:

| Permission | Lets that moderator |
|---|---|
| `take_actions` | Ban, time out or dismiss flagged accounts. |
| `manage_moderation_settings` | Change the moderation settings directly: sensitivity, manual/automatic mode, auto-timeout/auto-ban, timeout length, allowlist. No approval is needed once this is switched on. |

Every settings change is audit-logged with who made it, the old value and the new value, so the owner can always see and undo a moderator's change. Only the owner can grant or remove these permissions.

Technical consequences:
- The data model has `User`, `Channel` and a `ChannelMember` table (user, channel, role, permissions, granted_by, granted_at). Every query checks membership, and every write checks the specific permission on the server, never only in the UI.
- Before a grant succeeds, the system checks with Twitch that the person really is a moderator of that channel (Get Moderators, `moderation:read` scope on the streamer's token).
- When someone stops being a Twitch moderator, their access is removed automatically: the `channel.moderator.remove` EventSub event triggers it, and a periodic re-check covers any missed events.
- When a moderator bans or times someone out through Twitch Shield, it uses **their own** Twitch login. Twitch's own mod log then shows who really did it, and Twitch enforces their mod status for us.
- Granting, changing and removing access are all written to the audit log.

## 3. Code layout (Stage 1)

```
src/
  app/
    layout.tsx            Root HTML, fonts, metadata
    globals.css           Design tokens (colours) + Tailwind
    (app)/                Route group for all dashboard pages
      layout.tsx          App shell (sidebar / mobile menu)
      dashboard/ suspicious/ activity/ settings/ profile/
  components/
    layout/AppShell.tsx   Navigation, skip link, mobile menu
    ui/                   Card, StatCard, Badges, Icon, Notice
    dashboard/            Chart, activity list, suspicious table, connection card
  lib/
    domain/               Types, risk scoring, default settings (pure logic, unit-tested)
    data/                 Data access layer: pages call ONLY this
      index.ts            Today returns demo data tagged source:"demo"
      demo.ts             Fixed demo records ("demo_" usernames)
    format.ts             Date and duration formatting (UTC, fixed locale)
    navigation.ts         Sidebar items
e2e/                      Playwright browser + accessibility tests
```

**Key design rule:** every dataset is returned as `{ source: "demo" | "live", data }`. The UI shows a "Demo data" badge whenever the source is `demo`, so demo data can't be passed off as real. In Stage 2/3 only `src/lib/data/index.ts` changes.

## 4. Twitch permissions (scopes), requested per feature

Twitch Shield asks for each scope only when the user turns on the feature that needs it (incremental authorisation).

| Stage | Feature | Scope | Whose token |
|---|---|---|---|
| 2 | Sign in, show name and avatar | _none_ (public profile via Get Users) | Streamer and moderators |
| 2 | Confirm a person is a Twitch mod before granting access; auto-revoke when they're unmodded | `moderation:read` | Streamer |
| 3 | Read chat | `user:read:chat` | Twitch Shield bot account (or the streamer for WebSocket dev mode) |
| 3 | Bot may act in a channel without being a mod | `channel:bot` | Streamer |
| 3 | Bot identity for app-token chat | `user:bot` | Twitch Shield bot account |
| 3 | Twitch's own suspicious-user / ban-evasion signals | `moderator:read:suspicious_users` | Streamer or mod |
| 3 | See bans/unbans made by other mods | `channel:moderate` (or the granular `moderator:read:banned_users`) | Streamer |
| 4 | Ban, unban, timeout | `moderator:manage:banned_users` | Streamer or mod |
| 4 | Delete spam messages | `moderator:manage:chat_messages` | Streamer or mod |
| 5 | Import the channel's existing ban list | `moderation:read` | Streamer only (Get Banned Users requires the broadcaster's own token) |

Not requested: `user:read:email` (not needed), and any scopes for subscriptions, payments or editing the channel.

Sources: Twitch EventSub reference (chat, channel-moderation) and the Helix Moderation reference, checked on 2026-11-11. Re-check each scope when its stage starts, because Twitch changes these.

## 5. Twitch limitations that affect the product vision

1. **There is no IP, device or email data.** Twitch gives third parties no way to link two accounts to one person. "Ban evader" detection relies on Twitch's own signal (`channel.suspicious_user.message`, which reports `ban_evasion_evaluation`: unknown, possible or likely) plus behaviour and username patterns. We can't prove two accounts are the same person.
2. **Silent viewbots are invisible.** Fake viewers who never chat produce no chat events. Get Chatters (`moderator:read:chatters`) lists usernames only. Twitch Shield can catch bots that chat, not view-count inflation.
3. **We can only act where we're authorised.** Bans and timeouts need a broadcaster or moderator token with the right scope. A channel's ban list can only be read with the broadcaster's own token.
4. **Timeouts max out at 14 days** (1–1,209,600 seconds), and a ban reason can be at most 500 characters. Helix rate limits return HTTP 429, so automatic actions need queueing and back-off.
5. **EventSub WebSocket limits.** Each user token can have 3 connections with at most 300 subscriptions per connection. That's fine for development but won't scale to a SaaS. Production should use webhooks or Conduits with an app token. That route needs `channel:bot` from each streamer and needs public HTTPS hosting.
6. **Twitch already has Shared Ban Info.** Channels can share ban lists with up to 30 other channels natively. The Stage 5 offering must add value beyond that, for example evidence-based risk scores and cross-channel spam pattern detection.
7. **The Developer Agreement and data sharing need review.** Search results quote clauses restricting sharing Twitch data with third parties without Twitch's permission, but the agreement page could not be read in full during research. **Stage 5 (shared intelligence) is blocked until the current Twitch Developer Services Agreement has been read in full, and probably until Twitch confirms the approach in writing.**
8. **UK GDPR.** A cross-channel record that flags someone as suspicious is personal data about chatters who never signed up to Twitch Shield. Stage 5 needs a lawful basis (likely legitimate interests, with a balancing test), a DPIA, retention limits, a way to contest a flag, and subject-access handling. Labelling a real person a "bot" also carries reputational and defamation risk. That's why evidence and confidence scores are required, never bare verdicts.
9. **Trademark.** Twitch's brand guidelines restrict using "Twitch" in third-party product names. "Twitch Shield" is a working title. Choose a final name before any public launch.

## 6. Security design (summary; implemented from Stage 2)

- OAuth authorisation-code flow with a random `state` value (CSRF protection), checked against a short-lived httpOnly cookie.
- Access and refresh tokens are kept server-side only and encrypted at rest (AES-256-GCM, key from an environment variable). They're never sent to the browser or written to logs.
- Sessions use an opaque random ID in an `httpOnly`, `Secure`, `SameSite=Lax` cookie, stored hashed in the database.
- Every data query is filtered by the session user's channel IDs, and tests check that one user can't read another's data.
- EventSub webhooks are verified with an HMAC-SHA256 signature. The message ID is used to reject replays, and the timestamp is checked to be within 10 minutes.
- Disconnecting revokes tokens at Twitch (`/oauth2/revoke`), deletes them locally, and records an audit entry.
- Rate limiting on login and API routes.
- Already in Stage 1: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, a strict referrer policy, a permissions policy, and no `X-Powered-By` header. A full nonce-based CSP comes in Stage 2.

## 7. Hosting recommendation (decide at Stage 3)

The web app and worker should run together on one small Linux VPS using Docker Compose, with managed or self-hosted Postgres and automated daily backups. This avoids vendor lock-in and keeps the always-on worker cheap. Expected cost is well under the ~$100/month budget, but **verify prices before committing**. Serverless hosting such as Vercel can't run the worker.

## 8. Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-11-11 | No database in Stage 1 | Nothing needed saving yet. Avoids premature schema decisions. |
| 2026-11-11 | Data layer returns `{source, data}` | Demo data can't be shown unlabelled, and the swap to live data is a one-file change. |
| 2026-11-11 | Settings form shown but disabled | A form that looks like it saves but doesn't would mislead users. It unlocks when settings can be stored per channel. |
| 2026-11-11 | Timestamps shown in UTC | Server and browser render identical text. Per-user timezone comes later. |
| 2026-11-11 | Dark-only theme | Product brief: Twitch-inspired dark UI. Contrast verified by axe. |
