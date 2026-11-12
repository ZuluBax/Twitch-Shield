# Twitch Shield (working title)

A moderation dashboard that helps Twitch streamers spot and remove bot and spam accounts in chat, using Twitch's official APIs.

## Purpose

Twitch Shield is a Twitch moderation platform designed to detect bots, spam accounts, suspicious users and potential ban evaders. It helps streamers protect their communities through automated moderation, account risk detection and shared cross-channel intelligence.

**Status:** Stage 1 of 5. This is a working dashboard with clearly labelled **demo data**. It is not connected to Twitch yet. See [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Requirements

- Node.js 24+ (tested on 24.15)
- npm 12+

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. It redirects to the dashboard.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server with live reload |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Check code style and common mistakes |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | Browser tests, including accessibility, on desktop and mobile (Playwright). Builds the app first. Run `npx playwright install chromium` once beforehand. |
| `npm run check` | All of the above in order. Run before committing. |

## Configuration

Stage 1 needs no configuration. From Stage 2, copy `.env.example` to `.env.local` and fill in your values. Never commit `.env.local`.

## Documentation

- [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md): stack, structure, Twitch scopes and limitations, security design
- [PROJECT_STATUS.md](PROJECT_STATUS.md): progress, test results, known issues, next steps
- [CLAUDE.md](CLAUDE.md): working rules for AI-assisted development

## Licence

GNU General Public License v3.0. See [LICENSE](LICENSE).
