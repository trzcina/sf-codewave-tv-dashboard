---
name: project-deploy
description: Use when deploying this repo to Vercel, changing the GitHub Actions pipeline, adding or changing environment variables, or debugging a failed deploy. Not for Flotiq schema, content or fetch code (see flotiq-schema, flotiq-content, flotiq-sdk).
---

# Project deploy (GitHub Actions → Vercel)

Deploys are done by `.github/workflows/deploy.yml`, not by Vercel's Git integration (`vercel.json` sets `git.deploymentEnabled: false` so connecting the repo in Vercel doesn't deploy twice).

## Pipeline

1. `check` job: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, on every push to `main` and every PR.
2. `deploy` job (after `check`): `vercel pull` → `vercel build` → `vercel deploy --prebuilt`.
   * push to `main` → **production** (`--prod`)
   * pull request from this repo → **preview**; the URL is shown in the job summary and the GitHub environment
   * PRs from forks are not deployed (no secrets)

## Where configuration lives

| What | Where |
|---|---|
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | GitHub repo → Actions secrets — set by the Factory when it creates the project |
| `FLOTIQ_API_KEY`, `FLOTIQ_CLIENT_AUTH_KEY` | Vercel project env (Production **and** Preview) — set by the Factory: `FLOTIQ_API_KEY` from the read-only key the user gives, `FLOTIQ_CLIENT_AUTH_KEY` itself, with the revalidation webhook |
| The names and placeholders | `.env.example` |

Agents have no Vercel or GitHub credentials: they don't set, print or commit any of these.

`vercel build` runs in CI but reads app env vars through `vercel pull`, so **Flotiq keys go in Vercel, not in GitHub secrets**. A variable added only to GitHub will not reach the build.

## Adding an environment variable

1. Add it to `.env.example` with a comment (never a real value), and read it from `process.env` in code.
2. The lead asks the user for its value (`ask`, kind `secret`, `secretName` = the variable's name); the Factory stores the answer in Vercel for Production and Preview. It applies from the next deployment.
3. Server-only secrets must not use the `NEXT_PUBLIC_` prefix.

## Debugging a failed deploy

* `check` failed: reproduce with `npm run lint && npm run typecheck && npm test`, and the build with the lead's `run_checks`.
* `vercel pull` failed with 403/404: the project's Vercel secrets are wrong — that's the Factory's setup, not a code change; report it.
* Build succeeds but the page says "Connect your Flotiq space": `FLOTIQ_API_KEY` is missing in that Vercel environment.
* Content edits don't show up on production: the Factory's Flotiq webhook to `/api/flotiq/revalidate` answers `401` until production has been deployed with `FLOTIQ_CLIENT_AUTH_KEY` (see `flotiq-sdk` → `references/nextjs-integration.md`). Don't change the route or add caching options.

## Completion checklist

* [ ] `npm run lint`, `npm run typecheck`, `npm test` pass, and the build in the lead's `run_checks`.
* [ ] New env vars are in `.env.example`, and the lead asked the user for their values.
* [ ] The Actions run for the change is green and the deployed URL works.
