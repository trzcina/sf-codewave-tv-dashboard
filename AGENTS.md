<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

This app is built by the Software Factory: a lead agent and its subagents (explorer, developer, flotiq) work on it, and the Factory itself owns the Flotiq keys, the Vercel environment and the revalidation webhook.


- Flotiq work: use the skills in `.claude/skills/` (`flotiq-schema`, `flotiq-content`, `flotiq-sdk`, `flotiq-typegen`, `flotiq-ui-sections`) and `project-deploy` for CI/Vercel. Pages, layouts and client components: `nextjs-app`.
- All Flotiq data access goes through `flotiqApiClient` from `lib/flotiq-api-client.ts`; no raw `fetch()` to the Flotiq API.
- Types are in `flotiq-api.d.ts`, generated from the live schema. Only the `flotiq` subagent regenerates it, with its `flotiq_typegen` tool — the shell has no Flotiq key, so `npm run typegen` fails there. Everyone else uses the file as it is: never hand-edit it or duplicate its interfaces; if it looks stale, tell the lead.
- Tests: add or update `*.test.ts` next to changed route handlers and next to changed `lib/*.ts` logic.

# How to work

- Next.js docs: read only the guide for the API you are about to use — not a survey. The patterns this project already uses (fonts, layout types, Tailwind v4, client state) are in the `nextjs-app` skill and in `app/layout.tsx`; copy them instead of researching.
- Never read library sources in `node_modules` (eslint plugins, `.d.ts` files, compiled code) to predict what lint or typecheck will say. Write the code, run the check, fix from its message.
- UI logic that can be tested (scoring, state transitions, data shaping) goes into pure functions in `lib/*.ts` with a `lib/*.test.ts` next to them. Vitest runs in the `node` environment and only picks up `*.test.ts`, so don't write component tests.
- Before finishing your piece: `npm run lint && npm run typecheck && npm test`. The build runs once, when all the pieces are in: that's the lead's `run_checks`, so don't run `npm run build` yourself.
