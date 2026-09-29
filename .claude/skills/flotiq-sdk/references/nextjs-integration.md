# Next.js integration

This repository is already wired: don't run `npx flotiq-nextjs-setup` — it would overwrite the files below.

## What is already in this repo

| File | Purpose |
|---|---|
| `lib/flotiq-api-client.ts` | The one shared `flotiqApiClient` (SDK + `@flotiq/nextjs-addon` middleware). Also exports `isFlotiqConfigured`. |
| `app/api/flotiq/draft/route.ts` | Toggles Next.js draft mode, guarded by `FLOTIQ_CLIENT_AUTH_KEY`. |
| `app/api/flotiq/revalidate/route.ts` | Webhook target: `revalidateTag("flotiq-content", "max")`. |
| `next.config.ts` | `images.remotePatterns` for `https://api.flotiq.com/image/**`. |
| `.env.example` | `FLOTIQ_API_KEY`, `FLOTIQ_CLIENT_AUTH_KEY` — the Factory sets both on Vercel. |

## Shared client

Import it everywhere. Never construct a new client per route or component:

```ts
import { flotiqApiClient } from "@/lib/flotiq-api-client";
```

`createNextMiddleware()` from `@flotiq/nextjs-addon` does the Next.js-specific work, so fetch code stays plain SDK calls:

* tags every request with `flotiq-content` and `flotiq-content-<ctdApiName>` (use the latter for targeted `revalidateTag`),
* sets `next.revalidate` to 1 day by default (`createNextMiddleware({ revalidateTime })` to change it); `lib/flotiq-api-client.ts` passes `revalidateTime: 0` when `VERCEL_ENV` is `preview`, so PR previews always read Flotiq fresh,
* in draft mode sends `x-mode: preview` (drafts included), otherwise `x-visibility: public` (published only), so fetch code never branches on draft state,
* uses `cache: "no-store"` in development, in draft mode, and for write requests.

## RSC fetch pattern

In React Server Components use the SDK's typed methods. The method name (`blogpost` below) is the CTD **API name**; it becomes typed once the `flotiq` subagent has generated `flotiq-api.d.ts`. In Next.js 15+ `params` is a `Promise`.

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { flotiqApiClient } from "@/lib/flotiq-api-client";

export default async function BlogPostPage({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const result = await flotiqApiClient.content.blogpost.list({
    limit: 1,
    hydrate: 1,
    filters: { slug: { type: "equals", filter: slug } },
  });
  const post = result.data[0]; // typed via generated flotiq-api.d.ts
  if (!post) notFound();
  // render post…
}
```

If a content type is missing on `flotiqApiClient.content`, typegen hasn't been run since that CTD was created: tell the lead; don't run typegen yourself. Generated types augment the `@flotiq/flotiq-api-sdk` module, so import them from there: `import type { Blogpost } from "@flotiq/flotiq-api-sdk"`.

Media URLs: `flotiqApiClient.helpers.getMediaUrl(media, { width, height })`, rendered with `next/image`.

## Draft mode

```
https://<host>/api/flotiq/draft?key=<FLOTIQ_CLIENT_AUTH_KEY>&redirect=/blog/my-post
```

Without `draft=true|false` it toggles. Only relative `redirect` paths are honored. `FLOTIQ_CLIENT_AUTH_KEY` is the Factory's own secret, and the Flotiq panel's preview link isn't set up yet: keep the route as it is, don't build draft features on it.

## Revalidation

Caching and revalidation are already set up: the template's `flotiqApiClient` (1 day in production, no cache in PR previews) and a Flotiq webhook to `/api/flotiq/revalidate` that the Factory creates. Keep them: don't add `export const revalidate`, `dynamic` or `cache` options for Flotiq data, don't run `flotiq-nextjs-setup` and don't create webhooks.

What the Factory sets up, and what follows from it:

* After a task passes its checks, the Factory puts `FLOTIQ_CLIENT_AUTH_KEY` in the Vercel env (production and preview) and creates or updates the webhook `Software Factory: revalidate <projectId>` for the space's own content types.
* Production gets the key with its next deploy, i.e. when the task is published. Until then the webhook's calls answer `401`: edits in Flotiq show up in production only after that first deploy, or once the day's cache runs out.
* The webhook covers the space's own content types, not `_media`. Replacing an image file in the media library doesn't refresh the cache until an object that uses it changes (or the day's cache runs out).
* A content type added later joins the webhook on the next task that passes.

The webhook calls `POST https://<production-host>/api/flotiq/revalidate` with the header `x-editor-key: <FLOTIQ_CLIENT_AUTH_KEY>`; the route answers `204` on success and `401` on a wrong key, and invalidates everything tagged `flotiq-content`. Keep the route as it is.

## After schema changes

The types in `flotiq-api.d.ts` must be regenerated before you trust the shapes used in fetch code. The `flotiq` subagent does this with its `flotiq_typegen` tool; if the file looks stale, tell the lead.

See [Next.js integration](https://flotiq.com/docs/Universe/nextjs/nextjs-setup) for the full setup reference.
