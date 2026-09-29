# Typegen workflow

Types come from the `flotiq` subagent's `flotiq_typegen` tool. It runs `flotiq-api-typegen` against the **live schema** of the project's Flotiq space (it isn't a static template), with the project's key, and writes `flotiq-api.d.ts`. The shell has no key: `npm run typegen` there fails.

## When to run it

* Right after creating a new Content Type.
* Right after adding, renaming, or removing a field on an existing Content Type.
* Right after changing a relation's target type or multiplicity.
* Before handing the contract to the lead: developers write fetch/render code against these types (the `flotiq-sdk` workflow).

## Committed, not generated at build

The generated file is committed with the change. The app then type-checks and builds without a live connection to Flotiq — in CI, in the Factory's checks, and in pull requests that touch content shapes.

## Keeping generated files untouched

Treat the generated output as read-only. If something about it looks wrong, that's a signal to check the Content Type Definition (see the `flotiq-schema` skill) rather than to patch the generated file — a manual edit is overwritten by the next regeneration and masks the real schema issue.
