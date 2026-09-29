---
name: flotiq-typegen
description: Use when TypeScript types for Flotiq content need to be generated or refreshed after a Content Type change — the `flotiq` subagent's `flotiq_typegen` tool writes `flotiq-api.d.ts`. Not for schema design (see flotiq-schema) or SDK/fetch code (see flotiq-sdk).
---

# Flotiq Typegen

Generate and maintain the TypeScript definitions for Flotiq content in `flotiq-api.d.ts`. Three rules — kept deliberately small. Not for schema design (`flotiq-schema`) or fetch/render code (`flotiq-sdk`).

## Who runs it

Only the `flotiq` subagent, with its `flotiq_typegen` tool: the tool holds the project's Flotiq key, the shell doesn't — `npm run typegen` in the shell fails. Everyone else uses `flotiq-api.d.ts` as it is; if it looks stale, tell the lead.

## When to use

After any Content Type is created or changed, before code depends on the new shape.

## Workflow

1. Call `flotiq_typegen` after the last content type change. It runs `npm run typegen` (`flotiq-api-typegen`) with the key and writes `flotiq-api.d.ts` in the project root.
2. Never hand-edit the output — if a generated type looks wrong, fix the CTD (`flotiq-schema`) and regenerate. `flotiq-api.d.ts` is in the `globalIgnores` of `eslint.config.mjs`, so lint errors in it never need fixing or suppressing.
3. The generated file is committed with the change, so builds don't need a live Flotiq connection.

## Common mistakes

* Forgetting to regenerate after a schema change, so code compiles against a stale shape.
* Running `npm run typegen` in the shell instead of the tool.
* Hand-editing the generated file, or hand-writing a parallel interface instead of trusting it.

## Completion checklist

* [ ] `flotiq_typegen` ran successfully after the most recent schema change.
* [ ] The generated file has not been hand-edited.
* [ ] No duplicate handwritten interfaces exist alongside the generated types.

## References

* [`references/typegen-workflow.md`](references/typegen-workflow.md) — when to regenerate, and why the output is read-only.

## Official documentation

* [Flotiq SDK for Node.js/TypeScript](https://flotiq.com/docs/API/generate-package/sdk-nodejs/)
