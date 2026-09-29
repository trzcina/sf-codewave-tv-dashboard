# The flotiq_* content tools

The `flotiq` subagent works on the project's Flotiq space through these tools. They call Flotiq's MCP server (`https://mcp.flotiq.com/mcp`) with the project's key, which the tools hold — it isn't in the environment or in any file. Creating and changing CTDs is the `flotiq-schema` skill's job (see [`schema-tools.md`](../../flotiq-schema/references/schema-tools.md)).

## Tools

| Tool | Use |
|---|---|
| `flotiq_list_content_types` | Discover Content Types by name, without schema details. The starting point for any content work: the CTD's API name is the `content_type_definition_name` of every object call. |
| `flotiq_get_content_type(name)` | Read a type's fields, required flags and relations before writing objects — never guess field names. |
| `flotiq_list_objects(content_type_definition_name, limit, include_drafts)` | List existing objects of a type — check for duplicates, sample existing tone/style, find relation targets, verify a batch. |
| `flotiq_get_object(content_type_definition_name, object_id)` | Fetch one object — resolve a relation target, or verify a create/update/publish call. |
| `flotiq_create_object(content_type_definition_name, data)` | Create a new Content Object. |
| `flotiq_update_object(content_type_definition_name, object_id, data)` | Update an existing Content Object. |
| `flotiq_publish_object(content_type_definition_name, object_id, cascade)` | Publish a draft object. Requires **Draft & Public** to be enabled on that Content Type. |

A relation in `data` is a list: `[{"type": "internal", "dataUrl": "/api/v1/content/<type>/<id>"}]`.

## `flotiq_publish_object` details

* Only applies to Content Types with **Draft & Public** enabled. If a type doesn't have it, objects are live immediately on create/update and there's nothing to publish separately.
* `cascade` controls whether publishing an object also publishes the draft objects it relates to. Set it deliberately: `true` when a related object (e.g. a newly created `Author`) must go live together with the object referencing it; omit/`false` when related objects should stay in draft.
* After publishing, check the object's state with `flotiq_get_object` rather than assuming the call succeeded.

## Out of scope

* **Changing Content Type Definitions** — that's `flotiq-schema`. Don't add fields to a type just to fit content.
* **Media upload** — there is no upload tool. Use media that already exists in the space, or leave optional media fields empty and name the missing images in your report; the user uploads them in the panel.
* **Deleting** content types or objects — there is no delete tool. Something created by mistake is removed by the user in the panel; say so in your report.
