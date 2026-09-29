# Fetching content and hydrated relations

## Fetching

* Use the SDK's typed list/get methods against the generated types produced by `flotiq-typegen` — don't construct raw query strings or endpoints by hand when the SDK exposes a typed method for it.
  ```ts
  const { data } = await flotiqApiClient.content.<ctd>.list({ hydrate: 1, limit: 10, filters: { slug: { type: "equals", filter: slug } } });
  const one = await flotiqApiClient.content.<ctd>.get(id, { hydrate: 1 });
  ```
* Filter and paginate through the SDK's supported query options rather than over-fetching and filtering client-side.
* By default, only fetch published content for public-facing pages; fetching drafts is a deliberate choice tied to preview/draft mode, not the default path.

## Draft & Public

Draft & Public is a per-Content-Type setting in Flotiq that enables a two-state publish workflow (draft → public). Its effect on the SDK layer:

* When **disabled** (default), objects are live immediately on create/update — there's no draft state to filter on.
* When **enabled**, the SDK returns only published objects by default. To include drafts (e.g. for preview/draft mode), pass the appropriate draft parameter per the SDK docs — this should only happen inside an authenticated draft mode context, never on public-facing routes.
* If content is published in Flotiq but not appearing in the app, check whether Draft & Public is enabled and the object was explicitly published (not just saved). The `flotiq` subagent confirms it with `flotiq_get_object`; the user sees it in the panel.

For Next.js draft mode integration, see [`nextjs-integration.md`](nextjs-integration.md).

## Hydrated relations

* A "hydrated" relation returns the related object's data inline instead of just an ID/reference — request this whenever the UI renders data from the related object (an author's name on a post listing, a category's label on a product card).
* Only hydrate relations you actually render. Requesting hydration for unused relations bloats the response for no benefit.
* If a relation isn't hydrated and the UI needs its data, that's a bug to fix at the fetch call (request hydration), not by issuing a second manual fetch per object.

## Caching and revalidation

Caching and revalidation are already set up: the template's `flotiqApiClient` (1 day in production, no cache in PR previews) and a Flotiq webhook to `/api/flotiq/revalidate` that the Factory creates. Keep them: don't add `export const revalidate`, `dynamic` or `cache` options for Flotiq data, don't run `flotiq-nextjs-setup` and don't create webhooks. Why it works this way:

* Production caches Flotiq responses for a day, tagged `flotiq-content`; every change in Flotiq calls the webhook, which invalidates the tag, so edits show up without waiting.
* PR previews don't cache at all: the webhook points at production only, so a cached preview would never see an edit.
* A route-level `revalidate`, `dynamic = "force-dynamic"` or a fetch `cache` option would override this for the whole page — and either hide edits or throw the cache away.

Code examples for `list`, `get`, `search`, `getMediaUrl`, `instanceOf` and writes are in the **Quick reference** in [`../SKILL.md`](../SKILL.md). The full option list is in the SDK README (`node_modules/@flotiq/flotiq-api-sdk/README.md`). This repo's revalidation route is `app/api/flotiq/revalidate/route.ts`.
