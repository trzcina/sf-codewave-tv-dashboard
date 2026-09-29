---
name: flotiq-content
description: Use when populating a Flotiq project with Content Objects — creating, updating, and publishing entries, uploading media, writing sample or real content, and wiring up relationships between objects. Not for designing Content Types (see flotiq-schema) or frontend/SDK work (see flotiq-sdk).
---

# Flotiq Content

Populate Flotiq projects with high-quality Content Objects: create, update, publish, relate, and attach media. Assumes the Content Types already exist. Not for schema design (`flotiq-schema`) or frontend/SDK work (`flotiq-sdk`).

Tools: the `flotiq` subagent's `flotiq_list_content_types`, `flotiq_get_content_type`, `flotiq_list_objects`, `flotiq_get_object`, `flotiq_create_object`, `flotiq_update_object`, `flotiq_publish_object`. See [`references/content-tools.md`](references/content-tools.md) for parameters and the publish/cascade behavior.

## When to use

* Creating real or realistic sample/seed content for existing Content Types.
* Updating, republishing, or fixing relationships on existing objects.
* Uploading and attaching media with alt text.

## Workflow

1. `flotiq_list_content_types` to find the CTD name, `flotiq_get_content_type` to read its fields; `flotiq_list_objects` to see what already exists — avoid duplicates, match existing tone.
2. Resolve or create related objects first, in dependency order (e.g. `Author` before `BlogPost`).
3. Media: there is no upload tool. Reference media objects that already exist in the space (`flotiq_list_objects` on `_media`), or leave optional media fields empty and tell the lead which objects need images — the user adds them in the Flotiq panel.
4. `flotiq_create_object`/`flotiq_update_object` with every required field populated and relations pointing at real objects, never placeholder IDs. Independent objects can go out in one batch of calls; an object that relates to others waits for them.
5. `flotiq_publish_object` (with `cascade` decided deliberately) when Draft & Public is enabled — the app reads published content only.
6. `flotiq_get_object` (or `flotiq_list_objects` for a batch) to verify fields, relations, media, and publish state all match what was intended.
7. For a batch of sample content, keep tone and level of detail consistent across every object.

## Best practices

* Read the schema before writing content; never guess a field name or type.
* Write realistic, varied content — no "Sample Product 1" or repeated sentence templates.
* Relations always point at real, existing (or freshly created) objects.
* Alt text describes what the image shows, not the filename.
* Update only what was asked; don't regenerate unrelated fields.

## Common mistakes

* Creating objects without checking the CTD first.
* Placeholder or lorem-ipsum content when realistic sample data was asked for.
* Relations left pointing at IDs that don't exist.
* Missing or generic alt text; duplicate authors/categories created instead of reused.
* Calling `flotiq_publish_object` without checking Draft & Public is enabled, or forgetting `cascade`.
* Assuming media can be uploaded — it can't; say which images are missing instead.

## Completion checklist

* [ ] Schema was read before content was created; no accidental duplicate objects.
* [ ] Required fields populated; relations point at real objects.
* [ ] Media fields point at existing media with meaningful alt text, or the missing images are named in the report.
* [ ] Tone/style is consistent across the batch and with existing content.
* [ ] Publish state matches intent, and the result was re-fetched to confirm it.

## References

* [`references/content-tools.md`](references/content-tools.md) — the `flotiq_*` content tools and their parameters.
* [`references/content-quality.md`](references/content-quality.md) — writing realistic, consistent content.
* [`references/media-and-alt-text.md`](references/media-and-alt-text.md) — media upload workflow and alt text.
* [`references/relationships.md`](references/relationships.md) — wiring up object relationships.

## Official documentation

* [Creating new Content Objects](https://flotiq.com/docs/API/content-type/creating-co/)
* [Listing Content Objects](https://flotiq.com/docs/API/content-type/listing-co/)
* [Media library](https://flotiq.com/docs/API/media-library/)
* [Flotiq MCP Server](https://mcp.flotiq.com/mcp)
