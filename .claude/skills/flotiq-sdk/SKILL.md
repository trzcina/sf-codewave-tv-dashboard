---
name: flotiq-sdk
description: Use when building an application that reads or writes Flotiq content — SDK setup, API client creation, fetching content, hydrated relations, caching, and frontend integration (including Next.js). Not for designing Content Types (see flotiq-schema) or populating content (see flotiq-content).
---

# Flotiq SDK

Build applications on top of Flotiq using the official SDK: setup, fetching, hydration, caching, and frontend integration. Assumes the schema and content already exist. Strongly favors the SDK and generated types over hand-rolled alternatives. Not for schema design (`flotiq-schema`) or populating content (`flotiq-content`).

## When to use

* Setting up an app (Next.js or otherwise) to consume a Flotiq project.
* Adding or reviewing a data-fetching layer, especially one using raw `fetch()` or handwritten types.
* Checking how Flotiq content is cached and revalidated (it's already set up).

## Workflow

1. Use the shared `flotiqApiClient` from `lib/flotiq-api-client.ts` — the SDK is installed and the client configured. Avoid raw `fetch()` unless there's a specific, documented reason the SDK can't cover.
2. Confirm `flotiq-api.d.ts` has the types you need before writing fetch code — the `flotiq` subagent generates them; if one is missing, tell the lead — and use the generated types as the source of truth, no duplicate handwritten interfaces.
3. Fetch through the SDK's typed methods, requesting hydrated relations for anything the UI renders, instead of issuing manual follow-up fetches.
4. Caching and revalidation are already set up: the template's `flotiqApiClient` (1 day in production, no cache in PR previews) and a Flotiq webhook to `/api/flotiq/revalidate` that the Factory creates. Keep them: don't add `export const revalidate`, `dynamic` or `cache` options for Flotiq data, don't run `flotiq-nextjs-setup` and don't create webhooks.
5. The draft-mode and revalidation routes are in `app/api/flotiq/` — use them, don't reimplement them.
6. Verify end-to-end against real content — no `any`/manual casting papering over a type mismatch.

## Quick reference

Everything here is in the SDK README (`node_modules/@flotiq/flotiq-api-sdk/README.md`). Don't read the SDK's compiled sources or `.d.ts` files. `<ctd>` is the CTD **API name**, for example `blogpost`. It is typed once the `flotiq` subagent has generated `flotiq-api.d.ts`.

```ts
import { flotiqApiClient } from "@/lib/flotiq-api-client";
import type { Blogpost } from "@flotiq/flotiq-api-sdk"; // generated types augment the SDK module

// List: returns { data, total_count, total_pages, current_page, count }
const { data: posts } = await flotiqApiClient.content.blogpost.list({
  hydrate: 1,                     // 0 | 1 | 2: inline related objects (1 = one level)
  limit: 10,
  page: 1,                        // 1-based
  orderBy: "internal.createdAt",
  orderDirection: "desc",
  filters: { slug: { type: "equals", filter: "hello-world" } },
});

// Get one by id
const post: Blogpost = await flotiqApiClient.content.blogpost.get("blogpost-123", { hydrate: 1 });

// Full-text search scoped to one CTD
const found = await flotiqApiClient.content.blogpost.search({ q: "release" });
const firstHit = found.data[0]?.item; // typed as Blogpost

// Media URL for next/image (media comes from a hydrated media relation)
const src = flotiqApiClient.helpers.getMediaUrl(post.image[0], { width: 800 });

// Narrow an untyped relation or search hit
if (flotiqApiClient.helpers.instanceOf(post.category[0], "category")) {
  // post.category[0] is now typed as Category
}

// Writes (server-side only, with a write-capable key)
await flotiqApiClient.content.blogpost.create({ title: "New post", slug: "new-post" });
await flotiqApiClient.content.blogpost.patch("blogpost-123", { title: "Renamed" });
await flotiqApiClient.content.blogpost.delete("blogpost-123");
```

The field names above (`slug`, `image`, `category`) are examples. Use the ones in your generated types. Relation fields are arrays even when they hold a single item. Without `hydrate`, they contain `{ dataUrl, type }` links, not the related objects. For a full RSC page example, see [`references/nextjs-integration.md`](references/nextjs-integration.md#rsc-fetch-pattern).

## Best practices

* Official SDK over raw `fetch()`, always.
* Generated types are the source of truth. A mismatch means regenerating (`flotiq-typegen`) or fixing the schema (`flotiq-schema`) — both the `flotiq` subagent's — never hand-editing: report it to the lead.
* Hydrate only the relations you actually render.
* Leave caching to the template's client and the Factory's webhook.
* Draft/preview flows go through the SDK's built-in support, not a bespoke client.

## Common mistakes

* Raw `fetch()` instead of the SDK, losing typed responses and consistent auth handling.
* Handwritten interfaces duplicating (and drifting from) generated types.
* Hardcoded credentials instead of environment variables.
* N+1 manual fetches for relations that should have been hydrated.
* Adding route-level `revalidate`/`dynamic` or fetch `cache` options on top of the template's caching.
* Writing fetch code before `flotiq-api.d.ts` has the types it needs.
* Running `npm run typegen` in the shell. It has no Flotiq key and fails. Only the `flotiq` subagent regenerates types.

## Completion checklist

* [ ] All Flotiq data access goes through the SDK; no unexplained raw `fetch()`.
* [ ] Credentials come from environment variables.
* [ ] Generated types are current and used directly, with no duplicate interfaces.
* [ ] Rendered relations are fetched hydrated.
* [ ] Caching/revalidation: the template's defaults, untouched.
* [ ] (Next.js) Draft mode toggles correctly: `/api/flotiq/draft?key=<FLOTIQ_CLIENT_AUTH_KEY>` shows unpublished content.

## References

* [`references/sdk-setup.md`](references/sdk-setup.md) — installing the SDK, client, environment variables.
* [`references/fetching-and-hydration.md`](references/fetching-and-hydration.md) — fetching, hydration, caching.
* [`references/nextjs-integration.md`](references/nextjs-integration.md) — Next.js setup, draft mode, revalidation.

## Official documentation

* [Flotiq SDK for Node.js/TypeScript](https://flotiq.com/docs/API/generate-package/sdk-nodejs/)
* [`@flotiq/flotiq-api-sdk` on npm](https://www.npmjs.com/package/@flotiq/flotiq-api-sdk)
* [Next.js integration](https://flotiq.com/docs/Universe/nextjs/nextjs-setup)
* [Flotiq Documentation](https://flotiq.com/docs/)
