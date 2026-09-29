# Flotiq Next.js starter for the Software Factory

The template every Software Factory project starts from: a minimal [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind) app wired to the [Flotiq](https://flotiq.com) headless CMS through the official [`@flotiq/flotiq-api-sdk`](https://www.npmjs.com/package/@flotiq/flotiq-api-sdk), deployed to [Vercel](https://vercel.com) from GitHub Actions.

It is tailored to the Factory. The Factory creates each project from it (a GitHub repo `sf-<projectId>` and a Vercel project), and its agents — a lead with an explorer, developers and a `flotiq` subagent — change the app following `AGENTS.md` and the [skills](#agent-skills) in `.claude/skills/`, which are written for them.

## What's inside

| Path | Purpose |
|---|---|
| `lib/flotiq-api-client.ts` | Shared SDK client with `@flotiq/nextjs-addon` middleware (cache tags, draft mode); no cache in PR previews |
| `app/page.tsx` | Example page listing the latest images from the Flotiq Media library |
| `app/api/flotiq/draft/route.ts` | Enables/disables Next.js draft mode (preview of unpublished content) |
| `app/api/flotiq/revalidate/route.ts` | Target of the Factory's Flotiq webhook: invalidates cached Flotiq content |
| `.github/workflows/deploy.yml` | Lint, typecheck and tests, then Vercel preview (PRs) / production (`main`) deploy |
| `.claude/skills/` | Flotiq skills, Next.js app patterns and the deploy skill, for the Factory's agents |
| `lib/persisted-state.ts` | `usePersistedState`: localStorage-backed state that passes lint and hydrates cleanly |
| `AGENTS.md` | The agents' rules for this repo |

## How the Factory uses it

* **Content in the user's Flotiq space.** When a request says the app's data lives in Flotiq, the lead asks the user for two keys of their space: a read-write key for the Factory, and a read-only one for the app. The `flotiq` subagent designs and creates the content types and content through Flotiq's MCP server with the read-write key, and generates `flotiq-api.d.ts`; developers write the app against those types.
* **Keys.** The Factory keeps the read-write key with the project, never in the repo or on Vercel. It sets `FLOTIQ_API_KEY` (the read-only key) and `FLOTIQ_CLIENT_AUTH_KEY` (its own secret for draft mode and the webhook) in the Vercel project, for Production and Preview. Without `FLOTIQ_API_KEY` the app builds but shows its "Connect your Flotiq space" screen.
* **Caching.** Production caches Flotiq responses for a day, tagged `flotiq-content`. After a task passes its checks, the Factory creates or updates a Flotiq webhook (`Software Factory: revalidate <projectId>`) that calls `POST <production>/api/flotiq/revalidate` on every change, so edits show up at once. The webhook points at production only, so PR previews don't cache at all.
* **Deploys.** The Factory sets the three `VERCEL_*` GitHub Actions secrets when it creates the project. Every task is a pull request with a preview deploy; publishing it merges to `main`, which deploys production. Vercel's own Git integration is off (`vercel.json`), so nothing deploys twice.
* **Generated types are committed.** `flotiq-api.d.ts` is part of the change, so builds need no live Flotiq connection; it's excluded from lint.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm test` | Unit tests (Vitest), run once |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run typegen` | Generate `flotiq-api.d.ts` from the space's content types (needs `FLOTIQ_API_KEY`; in the Factory the `flotiq` subagent's tool runs it) |

## Tests

Tests use [Vitest](https://vitest.dev) and sit next to the code they cover (`*.test.ts`). They run in the Factory's checks and in CI before every deploy. The starter covers the Flotiq API routes: the auth key check, draft mode toggling, redirect safety, and cache revalidation. `next/*` server APIs are mocked, so tests need no Flotiq key or network.

## Running a project locally

To look at a Factory project on your machine: clone its `sf-<projectId>` repo, copy `.env.example` to `.env.local` and put a read-only key of the project's Flotiq space in `FLOTIQ_API_KEY` (any random string in `FLOTIQ_CLIENT_AUTH_KEY`), then `npm install && npm run dev`. Changes go through the Factory, so its records and the Flotiq content stay in step.

## Agent Skills

`.claude/skills/` contains single-purpose playbooks for the Factory's agents (Claude Code and other Agent Skills-compatible tools load them the same way).

| Skill | Answers |
|---|---|
| `flotiq-schema` | How should the `flotiq` subagent design or evolve a Content Type? |
| `flotiq-content` | How does it populate the space with good content? |
| `flotiq-typegen` | How are the TypeScript types generated and kept current? |
| `flotiq-sdk` | How does the app read Flotiq content (client, hydration, caching, draft mode)? |
| `flotiq-ui-sections` | How do I render Flotiq page sections with `@flotiq/flotiq-flowbite-next`? |
| `nextjs-app` | Which fonts, Tailwind, client-state and lint patterns work in this Next 16 / React 19 setup? |
| `project-deploy` | How is this repo deployed, and where do env vars come from? |

The Flotiq skills are based on the Flotiq Agent Skills project, adapted to this codebase and to the Factory.
